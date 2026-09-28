/**
 * Dynamic App Portal Engine
 * Automatically discovers, parses metadata, and renders app cards.
 * Includes built-in fallback data to support file:// protocol opening.
 */

class AppPortal {
    constructor() {
        this.defaultApps = [
            {
                folder: 'app2',
                title: 'La-Fierce (Android)',
                description: 'Your bold, positive, and empowering social platform. Connect with others, share your story, celebrate the community, and earn your place in the fierce world.',
                icon: '📱',
                platform: 'Android Mobile',
                tags: ['Android', 'Social', 'Mobile', 'User Manual'],
                entryUrl: 'app2/index.html',
                source: 'default'
            },
            {
                folder: 'app3',
                title: 'Admin Console (Android)',
                description: 'Manage success stories, edit profiles, and curate inspirational content for La-Fierce.',
                icon: '📱',
                platform: 'Android Admin',
                tags: ['Android', 'Admin', 'CRUD', 'User Manual'],
                entryUrl: 'app3/index.html',
                source: 'default'
            },
            {
                folder: 'app4',
                title: 'Admin Console (Desktop)',
                description: 'Windows-based CRUD tool with authentication, rich data visualization, and REST API integration.',
                icon: '🖥️',
                platform: 'Windows Desktop',
                tags: ['WinForms', 'Desktop', 'C#', 'User Manual'],
                entryUrl: 'app4/index.html',
                source: 'default'
            }
        ];

        this.apps = [...this.defaultApps];
        this.filteredApps = [...this.defaultApps];
        this.activeCategory = 'All';
        this.searchQuery = '';
        this.probingLimit = 15; // Number of appN candidate folders to probe automatically

        this.init();
    }

    async init() {
        this.setupTheme();
        this.setupEventListeners();
        await this.loadAllApps();
        this.render();
    }

    /* ─── Theme Management ─── */
    setupTheme() {
        const savedTheme = localStorage.getItem('portal-theme') || 'dark';
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }

    toggleTheme() {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('portal-theme', isDark ? 'dark' : 'light');
    }

    /* ─── Event Listeners ─── */
    setupEventListeners() {
        const themeBtn = document.getElementById('theme-toggle-btn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => this.toggleTheme());
        }

        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.filterApps();
            });
        }

        const scanBtn = document.getElementById('scan-new-apps-btn');
        if (scanBtn) {
            scanBtn.addEventListener('click', () => this.scanForNewApps(true));
        }

        const categoryPills = document.querySelectorAll('.category-pill');
        categoryPills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                categoryPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.activeCategory = pill.dataset.category || 'All';
                this.filterApps();
            });
        });
    }

    /* ─── Load Apps from Default, Manifest & Prober ─── */
    async loadAllApps() {
        const knownAppsMap = new Map();

        // 1. Seed with built-in default apps
        this.defaultApps.forEach(app => {
            knownAppsMap.set(app.folder, { ...app });
        });

        // 2. Try fetching apps.json manifest (works on http/https, catches CORS on file://)
        try {
            const res = await fetch('apps.json');
            if (res.ok) {
                const data = await res.json();
                if (data.apps && Array.isArray(data.apps)) {
                    data.apps.forEach(app => {
                        knownAppsMap.set(app.folder, {
                            folder: app.folder,
                            title: app.title || app.folder,
                            description: app.description || 'Application user manual and documentation.',
                            icon: app.icon || '📱',
                            platform: app.platform || 'Web App',
                            tags: app.tags || ['User Manual'],
                            entryUrl: `${app.folder}/index.html`,
                            source: 'manifest'
                        });
                    });
                }
            }
        } catch (err) {
            console.info('Running in local/static mode. Using pre-seeded app registry and folder scanner.');
        }

        // 3. Dynamic Folder Probing for newly added folders (if HTTP environment allows)
        try {
            await this.probeCandidateFolders(knownAppsMap);
        } catch (e) {
            // Safe fallback if local file fetch fails
        }

        this.apps = Array.from(knownAppsMap.values());
        this.filterApps();
    }

    /* ─── Probe Candidate Folders ─── */
    async probeCandidateFolders(knownAppsMap) {
        const candidateFolders = [];

        // Probe app1 to app15
        for (let i = 1; i <= this.probingLimit; i++) {
            candidateFolders.push(`app${i}`);
        }

        // Add potential custom folder patterns
        candidateFolders.push('app', 'app1', 'app5', 'app6', 'app7', 'app8', 'project', 'manual', 'docs');

        const probePromises = candidateFolders.map(async (folder) => {
            if (knownAppsMap.has(folder) && knownAppsMap.get(folder).source !== 'default') {
                return; // Already loaded from manifest or custom registration
            }

            const parsedApp = await this.tryParseFolderMetadata(folder);
            if (parsedApp) {
                knownAppsMap.set(folder, parsedApp);
            }
        });

        await Promise.all(probePromises);
    }

    /* ─── Try Fetching and Parsing [folder]/index.html ─── */
    async tryParseFolderMetadata(folder) {
        const targetUrl = `${folder}/index.html`;

        try {
            const response = await fetch(targetUrl, { method: 'GET' });
            if (!response.ok) return null;

            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            // Metadata extractions
            const title = doc.querySelector('title')?.textContent?.trim()
                       || doc.querySelector('h1')?.textContent?.trim()
                       || folder;

            const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content')
                          || doc.querySelector('p')?.textContent?.trim()
                          || 'Newly added application portfolio page.';

            const metaIcon = doc.querySelector('meta[name="app-icon"]')?.getAttribute('content')
                          || this.inferIconFromText(title + ' ' + htmlText);

            const metaPlatform = doc.querySelector('meta[name="app-platform"]')?.getAttribute('content')
                               || this.inferPlatformFromText(title + ' ' + htmlText);

            const metaTagsAttr = doc.querySelector('meta[name="app-tags"]')?.getAttribute('content');
            const tags = metaTagsAttr ? metaTagsAttr.split(',').map(t => t.trim()) : ['Auto-Discovered', 'User Manual'];

            return {
                folder: folder,
                title: title,
                description: metaDesc.length > 180 ? metaDesc.substring(0, 180) + '...' : metaDesc,
                icon: metaIcon,
                platform: metaPlatform,
                tags: tags,
                entryUrl: targetUrl,
                source: 'auto-discovered'
            };
        } catch (e) {
            return null; // Folder does not exist or fetch restricted
        }
    }

    /* ─── Infer Icon from Text Content ─── */
    inferIconFromText(text) {
        const lower = text.toLowerCase();
        if (lower.includes('desktop') || lower.includes('winform') || lower.includes('windows')) return '🖥️';
        if (lower.includes('android') || lower.includes('mobile') || lower.includes('phone')) return '📱';
        if (lower.includes('api') || lower.includes('backend') || lower.includes('server')) return '🌐';
        return '✨';
    }

    /* ─── Infer Platform from Text Content ─── */
    inferPlatformFromText(text) {
        const lower = text.toLowerCase();
        if (lower.includes('winform') || lower.includes('desktop')) return 'Windows Desktop';
        if (lower.includes('android')) return 'Android App';
        if (lower.includes('web')) return 'Web Portal';
        return 'Interactive App';
    }

    /* ─── Interactive Scan for New Apps ─── */
    async scanForNewApps(showNotification = false) {
        const initialCount = this.apps.length;
        await this.loadAllApps();
        const newCount = this.apps.length;

        if (showNotification) {
            const toast = document.getElementById('toast-notification');
            if (toast) {
                const added = newCount - initialCount;
                toast.textContent = added > 0
                    ? `🎉 Found ${added} new app folder(s)! Updated list.`
                    : `✅ Scan complete. All ${newCount} app folders are up to date!`;
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3500);
            }
        }
    }

    /* ─── Filter Apps by Category and Search ─── */
    filterApps() {
        this.filteredApps = this.apps.filter(app => {
            // Category filter
            let matchesCategory = true;
            if (this.activeCategory !== 'All') {
                const catLower = this.activeCategory.toLowerCase();
                matchesCategory = app.platform.toLowerCase().includes(catLower)
                               || app.tags.some(tag => tag.toLowerCase().includes(catLower))
                               || (catLower === 'mobile' && app.icon === '📱')
                               || (catLower === 'desktop' && app.icon === '🖥️');
            }

            // Search filter
            let matchesSearch = true;
            if (this.searchQuery) {
                matchesSearch = app.title.toLowerCase().includes(this.searchQuery)
                             || app.description.toLowerCase().includes(this.searchQuery)
                             || app.platform.toLowerCase().includes(this.searchQuery)
                             || app.tags.some(t => t.toLowerCase().includes(this.searchQuery));
            }

            return matchesCategory && matchesSearch;
        });

        this.render();
    }

    /* ─── Render Apps Container & Stats ─── */
    render() {
        const container = document.getElementById('apps-container');
        const statsEl = document.getElementById('total-apps-count');
        const visibleEl = document.getElementById('visible-apps-count');

        if (statsEl) statsEl.textContent = this.apps.length;
        if (visibleEl) visibleEl.textContent = this.filteredApps.length;

        if (!container) return;

        if (this.filteredApps.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-16 text-center text-slate-400 dark:text-slate-500">
                    <div class="text-5xl mb-4">🔍</div>
                    <h3 class="text-xl font-bold mb-2 text-slate-700 dark:text-slate-300">No matching applications found</h3>
                    <p class="text-sm">Try adjusting your search terms or filter selection.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredApps.map(app => `
            <a href="${app.entryUrl}" class="group block h-full focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-2xl">
                <div class="glass-card p-8 rounded-2xl shadow-sm group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col h-full border border-slate-200/80 dark:border-slate-800">

                    ${app.source === 'auto-discovered' ? `
                        <span class="absolute top-4 right-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20">
                            Auto-Discovered
                        </span>
                    ` : ''}

                    <div>
                        <div class="w-14 h-14 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300 shadow-inner">
                            ${app.icon}
                        </div>

                        <div class="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">
                            ${app.platform}
                        </div>

                        <h3 class="text-2xl font-bold mb-3 text-slate-800 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            ${app.title}
                        </h3>

                        <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                            ${app.description}
                        </p>
                    </div>

                    <div class="mt-auto pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                        <div class="flex flex-wrap gap-1.5">
                            ${app.tags.slice(0, 3).map(tag => `
                                <span class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-medium px-2 py-0.5 rounded-md">
                                    ${tag}
                                </span>
                            `).join('')}
                        </div>

                        <span class="text-orange-600 dark:text-orange-400 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Launch Guide →
                        </span>
                    </div>

                </div>
            </a>
        `).join('');
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.portalApp = new AppPortal();
});
