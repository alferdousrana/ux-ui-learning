/* ==========================================================================
   Figma plugin database.
   IMPORTANT: Every record is a real, publicly listed Figma Community plugin as
   known at authoring time. Plugin availability, names, pricing and features
   change often, so every record carries status:'needs-verification' until a
   maintainer checks it on figma.com/community and sets lastVerified.
   Schema supports 500+ records (search keywords, filters, pagination).
   ========================================================================== */
export const PLUGIN_CATEGORIES = ['Images & media', 'Icons & illustration', 'Content & data', 'Accessibility', 'Layers & cleanup', 'Design system & tokens', 'Layout & alignment', 'Color', 'Shapes & effects', 'Animation & prototyping', 'Mockups', 'Code & handoff', 'Charts & maps', 'AI-assisted', 'Workflow & integrations'];
export const PLUGIN_USE_CASES = ['Wireframing', 'UI design', 'Design systems', 'Accessibility audit', 'Prototyping', 'Handoff', 'Presentation', 'Content population', 'Housekeeping'];

const P = (name, category, level, does, why, when, workflow, useCase, kw, extra = {}) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), name, category, level, does, why, when, workflow, useCase, kw,
  status: 'needs-verification', lastVerified: null, ...extra,
});

export const PLUGINS = [
  P('Unsplash', 'Images & media', 'Beginner', 'Inserts free high-resolution photos from Unsplash into selected shapes.', 'Realistic imagery makes mockups and tests more believable.', 'Filling image placeholders in hi-fi mockups.', 'UI design', 'Content population', 'photos images stock pictures placeholder'),
  P('Pexels', 'Images & media', 'Beginner', 'Searches and inserts free stock photos and videos from Pexels.', 'Alternative source of royalty-free imagery.', 'When you need diverse photo options.', 'UI design', 'Content population', 'photos images stock video'),
  P('Remove BG', 'Images & media', 'Beginner', 'Removes image backgrounds using the remove.bg service (API key required).', 'Clean product cut-outs without leaving Figma.', 'E-commerce product shots, avatars.', 'UI design', 'UI design', 'remove background cutout transparent png', { note: 'Requires a remove.bg API key; free tier limits may change.' }),
  P('Photopea', 'Images & media', 'Intermediate', 'Opens a Photopea image editor inside Figma for raster edits.', 'Quick photo edits without switching apps.', 'Retouching or masking images.', 'UI design', 'UI design', 'photo edit raster photoshop image'),
  P('TinyImage Compressor', 'Images & media', 'Beginner', 'Exports compressed images (PNG/JPG/WebP) from Figma.', 'Smaller assets for faster websites.', 'Exporting images for production.', 'Handoff', 'Handoff', 'compress export optimize webp jpg png size'),
  P('Downsize', 'Images & media', 'Beginner', 'Reduces the file size of large images inside a Figma file.', 'Keeps heavy files fast.', 'When a file becomes slow due to images.', 'Housekeeping', 'Housekeeping', 'compress reduce image size performance'),

  P('Iconify', 'Icons & illustration', 'Beginner', 'Imports icons from 100+ open-source icon sets (Material, Tabler, Phosphor and more) as vectors.', 'One search across many icon libraries.', 'Choosing consistent icons for UI.', 'UI design', 'UI design', 'icons icon sets svg material tabler'),
  P('Material Design Icons', 'Icons & illustration', 'Beginner', 'Inserts Google Material icons.', 'Standard, recognizable icon language.', 'Android or Material-based products.', 'UI design', 'UI design', 'icons material google android'),
  P('Phosphor Icons', 'Icons & illustration', 'Beginner', 'Inserts Phosphor icons in multiple weights.', 'Flexible icon family with consistent weights.', 'Products needing thin to bold icon variants.', 'UI design', 'UI design', 'icons weights phosphor'),
  P('Feather Icons', 'Icons & illustration', 'Beginner', 'Inserts the minimalist Feather icon set.', 'Clean, simple stroke icons.', 'Minimal interfaces and wireframes.', 'Wireframing', 'UI design', 'icons stroke minimal feather'),
  P('Heroicons', 'Icons & illustration', 'Beginner', 'Inserts Heroicons (outline and solid) by the makers of Tailwind CSS.', 'Matches Tailwind-based products.', 'Tailwind projects.', 'UI design', 'UI design', 'icons tailwind outline solid'),
  P('Iconscout', 'Icons & illustration', 'Beginner', 'Search icons, illustrations, 3D assets and Lottie animations from IconScout.', 'Large asset library in one place.', 'Marketing visuals and illustrations.', 'UI design', 'Presentation', 'icons illustrations 3d lottie assets'),
  P('Storyset', 'Icons & illustration', 'Beginner', 'Inserts customizable illustrations from Storyset by Freepik.', 'Quick illustrations for empty states and onboarding.', 'Empty states, onboarding screens.', 'UI design', 'UI design', 'illustrations empty state onboarding freepik'),
  P('Icons8', 'Icons & illustration', 'Beginner', 'Inserts icons, illustrations and photos from Icons8.', 'Many consistent icon styles.', 'Choosing a specific icon style.', 'UI design', 'UI design', 'icons illustrations photos'),

  P('Content Reel', 'Content & data', 'Beginner', 'Fills text and images with realistic names, addresses, avatars and more.', 'Real-looking content reveals layout issues lorem ipsum hides.', 'Populating lists, tables and profiles.', 'UI design', 'Content population', 'content names avatars data fill realistic'),
  P('Lorem ipsum', 'Content & data', 'Beginner', 'Generates placeholder text of chosen length.', 'Quick filler for early wireframes.', 'Only early wireframes — replace with real content later.', 'Wireframing', 'Content population', 'placeholder text lorem filler content'),
  P('Google Sheets Sync', 'Content & data', 'Intermediate', 'Pulls content from a Google Sheet into Figma layers.', 'Design with real data and update it in bulk.', 'Tables, product catalogs, localization.', 'UI design', 'Content population', 'data spreadsheet google sheets sync content'),
  P('Find and Replace', 'Content & data', 'Beginner', 'Finds and replaces text across layers or pages.', 'Fast copy updates.', 'Renaming a product or term everywhere.', 'Housekeeping', 'Housekeeping', 'text replace search copy'),
  P('Translator', 'Content & data', 'Intermediate', 'Machine-translates selected text layers into other languages.', 'Test layouts with longer or different scripts.', 'Checking localization (e.g. Bangla) early.', 'UI design', 'UI design', 'translate localization language i18n bangla'),

  P('Stark', 'Accessibility', 'Intermediate', 'Accessibility suite: contrast checker, vision simulator, focus order, alt-text annotations.', 'Catch accessibility issues during design.', 'Before handoff and in reviews.', 'Accessibility audit', 'Accessibility audit', 'accessibility contrast a11y wcag vision focus order', { note: 'Some features require a paid plan.' }),
  P('Contrast', 'Accessibility', 'Beginner', 'Checks WCAG contrast of selected text and background in real time.', 'Quick AA/AAA checks.', 'Every time you pick text colors.', 'Accessibility audit', 'Accessibility audit', 'contrast wcag accessibility color ratio'),
  P('A11y - Color Contrast Checker', 'Accessibility', 'Beginner', 'Scans a frame for text contrast issues against WCAG.', 'Audits whole screens at once.', 'Screen-level QA.', 'Accessibility audit', 'Accessibility audit', 'contrast audit accessibility wcag'),
  P('Able – Friction free accessibility', 'Accessibility', 'Beginner', 'Contrast checking and color-blindness simulation between two layers.', 'Lightweight contrast workflow.', 'Comparing two colors quickly.', 'Accessibility audit', 'Accessibility audit', 'contrast color blindness accessibility'),
  P('Color Blind', 'Accessibility', 'Beginner', 'Simulates designs under different types of color vision deficiency.', 'Ensures meaning isn\'t carried by color alone.', 'Charts, status colors, maps.', 'Accessibility audit', 'Accessibility audit', 'color blindness simulation deuteranopia protanopia'),

  P('Rename It', 'Layers & cleanup', 'Beginner', 'Batch-renames layers with patterns and sequences.', 'Clean layer names help handoff.', 'Before sharing files with developers.', 'Housekeeping', 'Housekeeping', 'rename layers batch naming'),
  P('Similayer', 'Layers & cleanup', 'Beginner', 'Selects layers that share properties (fill, font, size…).', 'Bulk edits on matching layers.', 'Updating all instances of an old style.', 'Housekeeping', 'Housekeeping', 'select similar layers bulk'),
  P('Clean Document', 'Layers & cleanup', 'Beginner', 'Removes hidden layers, ungroups single groups, rounds values, sorts layers.', 'Tidy files are easier to maintain.', 'Before handoff or publishing.', 'Housekeeping', 'Housekeeping', 'cleanup tidy hidden layers round'),
  P('Design Lint', 'Layers & cleanup', 'Intermediate', 'Finds layers missing styles (fills, text, effects, radius).', 'Keeps designs consistent with the system.', 'QA before handoff.', 'Design systems', 'Design systems', 'lint consistency styles missing qa'),
  P('Instance Finder', 'Layers & cleanup', 'Intermediate', 'Finds all instances of a component in a file.', 'Understand impact before changing components.', 'Auditing component usage.', 'Design systems', 'Design systems', 'instances components find usage'),

  P('Tokens Studio for Figma', 'Design system & tokens', 'Advanced', 'Manages design tokens with JSON, syncs to Git, and applies tokens to layers and variables.', 'Single source of truth between design and code.', 'Building or scaling a design system.', 'Design systems', 'Design systems', 'tokens json design system variables git sync'),
  P('Style Organizer', 'Design system & tokens', 'Intermediate', 'Finds and merges duplicate or unstyled colors and text.', 'Consolidates messy styles.', 'Cleaning up legacy files.', 'Design systems', 'Housekeeping', 'styles merge duplicate colors text'),
  P('Batch Styler', 'Design system & tokens', 'Intermediate', 'Edits multiple text or color styles at once.', 'Fast system-wide updates.', 'Changing font family across all styles.', 'Design systems', 'Design systems', 'styles batch edit typography'),
  P('Master', 'Design system & tokens', 'Advanced', 'Converts groups of identical layers into components and links them.', 'Componentize existing designs quickly.', 'Retrofitting a design system onto old files.', 'Design systems', 'Design systems', 'components convert link master'),
  P('EightShapes Specs', 'Code & handoff', 'Advanced', 'Generates component specification sheets (anatomy, spacing, properties).', 'Consistent documentation for developers.', 'Documenting design system components.', 'Handoff', 'Design systems', 'specs documentation anatomy spacing handoff'),

  P('Super Tidy', 'Layout & alignment', 'Beginner', 'Arranges frames into a grid and renames them by position.', 'Organized canvases and prototype order.', 'Organizing many screens.', 'Housekeeping', 'Housekeeping', 'tidy arrange frames grid rename'),
  P('Autoflow', 'Layout & alignment', 'Beginner', 'Draws flow arrows between selected frames or objects.', 'Quick user flow diagrams.', 'Documenting flows and journeys.', 'Wireframing', 'Presentation', 'flow arrows user flow connectors diagram'),
  P('Arc', 'Layout & alignment', 'Beginner', 'Curves text along an arc.', 'Badges, logos and decorative text.', 'Marketing visuals.', 'UI design', 'Presentation', 'curve text arc circle'),

  P('Coolors', 'Color', 'Beginner', 'Generates and imports color palettes.', 'Explore palettes quickly.', 'Early visual exploration.', 'UI design', 'UI design', 'color palette generator scheme'),

  P('Blobs', 'Shapes & effects', 'Beginner', 'Generates random organic blob shapes.', 'Decorative backgrounds.', 'Landing page illustrations.', 'UI design', 'Presentation', 'shapes blob organic background'),
  P('Get Waves', 'Shapes & effects', 'Beginner', 'Generates SVG wave shapes.', 'Section dividers and backgrounds.', 'Marketing pages.', 'UI design', 'Presentation', 'waves svg shapes divider'),
  P('Beautiful Shadows', 'Shapes & effects', 'Beginner', 'Creates realistic layered shadows based on a light source.', 'Natural-looking elevation.', 'Cards, modals, product shots.', 'UI design', 'UI design', 'shadow elevation depth'),
  P('Smooth Shadow', 'Shapes & effects', 'Beginner', 'Generates smooth multi-layer shadows.', 'Softer, more realistic elevation.', 'Elevation tokens.', 'UI design', 'Design systems', 'shadow smooth layered'),
  P('Isometric', 'Shapes & effects', 'Intermediate', 'Transforms layers into isometric projections.', 'Presentation and marketing visuals.', 'Showcasing screens in 3D-like views.', 'UI design', 'Presentation', 'isometric 3d perspective'),

  P('Figmotion', 'Animation & prototyping', 'Advanced', 'Timeline-based animation editor inside Figma; exports to CSS/Lottie-like formats.', 'Prototype complex motion.', 'Micro-interactions beyond Smart Animate.', 'Prototyping', 'Prototyping', 'animation motion timeline micro-interaction'),
  P('LottieFiles', 'Animation & prototyping', 'Intermediate', 'Inserts Lottie animations and converts Figma animations to Lottie.', 'Lightweight animations for apps.', 'Loading, success and onboarding animations.', 'Prototyping', 'Prototyping', 'lottie animation json motion'),

  P('Mockuuups Studio', 'Mockups', 'Beginner', 'Places designs into realistic device mockups.', 'Presentation-ready visuals.', 'Portfolio and stakeholder presentations.', 'Presentation', 'Presentation', 'mockup device iphone presentation portfolio'),
  P('Angle', 'Mockups', 'Beginner', 'Applies screens to angled device mockups.', 'Perspective mockups for portfolios.', 'Case study visuals.', 'Presentation', 'Presentation', 'mockup perspective device angle', { note: 'Plugin has had multiple versions; verify current name and pricing.' }),

  P('html.to.design', 'Code & handoff', 'Intermediate', 'Imports a live website into editable Figma layers.', 'Start redesigns from existing pages.', 'Redesign audits, competitor analysis.', 'UI design', 'UI design', 'import website html convert redesign'),
  P('Anima', 'Code & handoff', 'Advanced', 'Converts Figma designs to React, Vue or HTML code.', 'Faster prototypes in code.', 'Developer handoff experiments.', 'Handoff', 'Handoff', 'code react html export developer'),
  P('Builder.io', 'Code & handoff', 'Advanced', 'Converts Figma designs to code (Visual Copilot).', 'Accelerates front-end implementation.', 'Handoff for supported frameworks.', 'Handoff', 'Handoff', 'code ai export react developer', { note: 'AI features and pricing change frequently.' }),
  P('Locofy', 'Code & handoff', 'Advanced', 'Converts designs into front-end code with responsive tagging.', 'Turns designs into code faster.', 'MVPs and prototypes.', 'Handoff', 'Handoff', 'code export react flutter developer'),
  P('Zeplin', 'Code & handoff', 'Intermediate', 'Exports frames to Zeplin for specs and handoff.', 'Teams already using Zeplin for handoff.', 'Handoff in Zeplin-based teams.', 'Handoff', 'Handoff', 'handoff specs export zeplin'),

  P('Chart', 'Charts & maps', 'Intermediate', 'Creates data-driven charts (bar, line, pie, scatter) from real or random data.', 'Realistic dashboards.', 'Dashboard and analytics design.', 'UI design', 'UI design', 'chart graph data visualization dashboard'),
  P('Map Maker', 'Charts & maps', 'Beginner', 'Generates map images from Google Maps or Mapbox for a location.', 'Realistic map screens.', 'Delivery, ride and location apps.', 'UI design', 'UI design', 'map location google mapbox'),
  P('QR Code Generator', 'Charts & maps', 'Beginner', 'Generates QR codes as vectors.', 'Print and payment screens.', 'Posters, tickets, payment QR mockups.', 'UI design', 'UI design', 'qr code generator'),

  P('Relume', 'AI-assisted', 'Intermediate', 'Generates sitemaps and wireframes using the Relume component library.', 'Speeds up early website structure.', 'Website IA and wireframes.', 'Wireframing', 'Wireframing', 'ai sitemap wireframe website generate', { note: 'AI product; verify current Figma plugin availability and plan requirements.' }),
  P('Magician', 'AI-assisted', 'Intermediate', 'AI-powered icon, image and copy generation (by Diagram).', 'Quick AI-assisted assets and copy.', 'Exploration only.', 'UI design', 'Content population', 'ai generate icons copy images', { note: 'Diagram joined Figma; this plugin may be discontinued — verify before use.' }),

  P('Jira', 'Workflow & integrations', 'Intermediate', 'Shows and links Jira issues in Figma/FigJam.', 'Connects design work to engineering tickets.', 'Product teams using Jira.', 'Handoff', 'Handoff', 'jira tickets atlassian integration'),
  P('Typescales', 'Design system & tokens', 'Beginner', 'Generates a modular type scale from a base size and ratio.', 'Consistent typographic hierarchy.', 'Setting up text styles.', 'Design systems', 'Design systems', 'typography type scale font sizes ratio'),
];

export const PLUGIN_NOTE = 'Plugin records are real Figma Community plugins compiled from public listings. Availability, names, pricing and features change — each record is flagged "needs verification" until checked on figma.com/community. Add new records by following the same schema; the library supports 500+ entries with search, filters and pagination.';
