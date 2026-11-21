const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding VK STUDIO database...');

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.customizationRequest.deleteMany();
  await prisma.customerMessage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.websiteSetting.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const customerPasswordHash = await bcrypt.hash('customer123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'VK Studio Director',
      email: 'admin@vkstudio.com',
      password: adminPasswordHash,
      phone: '+91 98765 43210',
      address: 'VK Studio Headquarters, Design District 4B, Bengaluru, Karnataka, India',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Aarav Sharma',
      email: 'customer@vkstudio.com',
      password: customerPasswordHash,
      phone: '+91 98112 34567',
      address: 'Flat 402, Skyline Residency, Indiranagar, Bengaluru, Karnataka - 560038',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
  });

  console.log('✓ Created Admin (admin@vkstudio.com) & Customer (customer@vkstudio.com)');

  // Create Categories
  const categoriesData = [
    {
      name: 'Desk & Workspace',
      slug: 'desk-workspace',
      description: 'Ergonomic, modular, and weighted desktop essentials precision-crafted for creative professionals.',
      icon: 'Monitor',
    },
    {
      name: 'Custom Nameplates & Signage',
      slug: 'custom-nameplates-signage',
      description: 'Modern typographic signs, dual-tone architectural plaques, and executive desk displays.',
      icon: 'Tag',
    },
    {
      name: 'Articulated Figures & Collectibles',
      slug: 'articulated-collectibles',
      description: 'Print-in-place fluid kinetic creatures, low-poly collector pieces, and high-definition resin sculpts.',
      icon: 'Sparkles',
    },
    {
      name: 'Home Decor & Ambient Lighting',
      slug: 'home-decor-lighting',
      description: 'Algorithmic Voronoi lamps, organic geometric vessels, and architectural mood fixtures.',
      icon: 'Lamp',
    },
    {
      name: 'Personalized Gifts & Lithophanes',
      slug: 'personalized-gifts',
      description: 'Sub-micron photo-relief night lights, custom commemorative tokens, and bespoke monogram keepsakes.',
      icon: 'Gift',
    },
    {
      name: 'Functional 3D-Printed Gadgets',
      slug: 'functional-gadgets',
      description: 'High-tolerance mechanical accessories, artisan keyboard components, and engineered organizers.',
      icon: 'Cpu',
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.slug] = created;
  }
  console.log(`✓ Created ${Object.keys(categories).length} categories`);

  // Create Products
  const products = [
    {
      name: 'Articulated Cybernetic Dragon',
      slug: 'articulated-cybernetic-dragon',
      tagline: 'Print-in-place fluid kinetic sculpture with multi-axis vertebrae',
      description: 'Engineered as a single, contiguous print-in-place mechanical masterpiece. With 38 interlocked ball-and-socket vertebrae, this dragon coils and rests naturally in your hand. Printed with dual-hue optical co-extrusion filament that shifts chromatic spectrum as ambient light shifts.',
      basePrice: 1499,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80'
      ]),
      model3dType: 'dragon',
      categoryId: categories['articulated-collectibles'].id,
      isAvailable: true,
      isFeatured: true,
      leadTimeDays: 2,
      materials: JSON.stringify(['Silk Co-Extrusion PLA', 'Matte Carbon Fiber PLA', 'Ultra-Detail SLA Resin']),
      colors: JSON.stringify([
        { name: 'Nebula Purple/Gold', hex: '#8B5CF6' },
        { name: 'Obsidian Matte Black', hex: '#18181B' },
        { name: 'Emerald Forest Green', hex: '#059669' },
        { name: 'Cyberpunk Copper', hex: '#B45309' }
      ]),
      dimensions: '450 x 65 x 48 mm',
      weight: '165g',
      customizationFields: JSON.stringify([
        {
          id: 'size_variant',
          name: 'size_variant',
          label: 'Scale & Dimensions',
          type: 'select',
          isRequired: true,
          options: [
            { label: 'Standard Length (35 cm)', value: '35cm', priceModifier: 0 },
            { label: 'Grand Exhibit Edition (55 cm)', value: '55cm', priceModifier: 650 },
            { label: 'Pocket Wyrm (22 cm)', value: '22cm', priceModifier: -300 }
          ]
        },
        {
          id: 'horn_style',
          name: 'horn_style',
          label: 'Horn & Crest Geometry',
          type: 'radio',
          isRequired: true,
          options: [
            { label: 'Imperial Crown Horns', value: 'imperial', priceModifier: 0 },
            { label: 'Blade Cybernetic Horns', value: 'cybernetic', priceModifier: 150 },
            { label: 'Spined Wyvern Crest', value: 'wyvern', priceModifier: 200 }
          ]
        },
        {
          id: 'eye_accent',
          name: 'eye_accent',
          label: 'Hand-Inlaid Eye Color',
          type: 'select',
          isRequired: true,
          options: [
            { label: 'Ruby Crimson Red', value: 'ruby', priceModifier: 0 },
            { label: 'Sapphire Luminescent Blue', value: 'sapphire', priceModifier: 0 },
            { label: 'Glow-in-the-Dark Phosphor', value: 'phosphor', priceModifier: 120 }
          ]
        },
        {
          id: 'pedestal_inscription',
          name: 'pedestal_inscription',
          label: 'Custom Base Engraving (Optional)',
          type: 'text',
          placeholder: 'e.g. For Vikram – Keeper of Sparks',
          isRequired: false,
          priceModifier: 150,
          helpText: 'Includes a precision-matched display stand with your custom text.'
        }
      ]),
    },
    {
      name: 'Voronoi Parametric Ambient Lamp',
      slug: 'voronoi-parametric-ambient-lamp',
      tagline: 'Computational algorithmic shadow lattice with integrated warm LED module',
      description: 'Generated through mathematical Voronoi cellular tessellation, this ambient fixture transforms any room into a sanctuary of organic shadows. Crafted from high-temperature diffusion biopolymer with an integrated touch-dimmable warm 2700K LED core and braided textile cable.',
      basePrice: 2899,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80'
      ]),
      model3dType: 'lamp',
      categoryId: categories['home-decor-lighting'].id,
      isAvailable: true,
      isFeatured: true,
      leadTimeDays: 4,
      materials: JSON.stringify(['Ivory Ceramic Composite PLA', 'Terracotta Stone-Fill PLA', 'Smoked Translucent PETG']),
      colors: JSON.stringify([
        { name: 'Warm Bone White', hex: '#F5F5F0' },
        { name: 'Earthy Terracotta', hex: '#C25E3A' },
        { name: 'Charcoal Basalt', hex: '#262626' }
      ]),
      dimensions: '180 x 180 x 240 mm',
      weight: '480g',
      customizationFields: JSON.stringify([
        {
          id: 'lattice_density',
          name: 'lattice_density',
          label: 'Voronoi Cellular Density',
          type: 'select',
          isRequired: true,
          options: [
            { label: 'Medium Organic (Balanced Ambient Glow)', value: 'medium', priceModifier: 0 },
            { label: 'Fine Micro-Lattice (High Dramatic Shadow Contrast)', value: 'fine', priceModifier: 350 },
            { label: 'Minimalist Macro-Cells (Softer Ambient Diffusion)', value: 'macro', priceModifier: 0 }
          ]
        },
        {
          id: 'lamp_base_finish',
          name: 'lamp_base_finish',
          label: 'Weighted Studio Base',
          type: 'radio',
          isRequired: true,
          options: [
            { label: 'Solid Walnut Wood Ring', value: 'walnut', priceModifier: 400 },
            { label: 'Matte Anodized Black Ring', value: 'black_metal', priceModifier: 250 },
            { label: 'Matching Monolithic 3D Base', value: 'monolithic', priceModifier: 0 }
          ]
        },
        {
          id: 'lighting_spec',
          name: 'lighting_spec',
          label: 'Light Temperature & Dimming',
          type: 'select',
          isRequired: true,
          options: [
            { label: '2700K Sunset Warm Touch-Dimmable', value: 'warm', priceModifier: 0 },
            { label: 'RGB Smart WiFi / App Control Module', value: 'smart_rgb', priceModifier: 550 },
            { label: '4000K Neutral Studio Task Light', value: 'neutral', priceModifier: 0 }
          ]
        }
      ]),
    },
    {
      name: 'Architectural Dual-Layer Studio Nameplate',
      slug: 'architectural-studio-nameplate',
      tagline: 'Minimalist floating desk badge with extruded architectural typography',
      description: 'Engineered for executive desks, creative studios, and bespoke workspaces. Features a 12mm thick matte basalt backing plate with crisp 3D extruded lettering in brushed metallic gold or frosted architectural white. Chamfered edges and angled resting bevel.',
      basePrice: 1299,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80'
      ]),
      model3dType: 'nameplate',
      categoryId: categories['custom-nameplates-signage'].id,
      isAvailable: true,
      isFeatured: true,
      leadTimeDays: 2,
      materials: JSON.stringify(['Matte Engineering PLA', 'Metallic Silk Gold PLA', 'High-Density Composite']),
      colors: JSON.stringify([
        { name: 'Basalt Charcoal & Brushed Gold', hex: '#1C1917' },
        { name: 'Snow White & Matte Black', hex: '#F8FAFC' },
        { name: 'Navy Slate & Polished Copper', hex: '#1E293B' }
      ]),
      dimensions: '220 x 45 x 60 mm',
      weight: '210g',
      customizationFields: JSON.stringify([
        {
          id: 'custom_full_name',
          name: 'custom_full_name',
          label: 'Primary Name / Brand Title',
          type: 'text',
          placeholder: 'e.g. VIKRAM KASHYAP',
          isRequired: true,
          priceModifier: 0,
          helpText: 'Will be accurately extruded in bold geometric uppercase.'
        },
        {
          id: 'custom_subtitle',
          name: 'custom_subtitle',
          label: 'Secondary Designation / Studio Subtitle',
          type: 'text',
          placeholder: 'e.g. PRINCIPAL ARCHITECT & FOUNDER',
          isRequired: false,
          priceModifier: 100,
          helpText: 'Sub-line in elegant spaced typography.'
        },
        {
          id: 'typography_font',
          name: 'typography_font',
          label: 'Typographic Style',
          type: 'select',
          isRequired: true,
          options: [
            { label: 'Modern Bauhaus Geometric Sans', value: 'bauhaus', priceModifier: 0 },
            { label: 'Architectural Technical Mono', value: 'mono', priceModifier: 0 },
            { label: 'Editorial Roman Serif', value: 'serif', priceModifier: 100 }
          ]
        },
        {
          id: 'accent_inlay_finish',
          name: 'accent_inlay_finish',
          label: 'Lettering Inlay Finish',
          type: 'radio',
          isRequired: true,
          options: [
            { label: 'Silk Champagne Gold', value: 'gold', priceModifier: 150 },
            { label: 'Matte Architectural Titanium White', value: 'white', priceModifier: 0 },
            { label: 'Burnt Bronze Metallic', value: 'bronze', priceModifier: 150 }
          ]
        }
      ]),
    },
    {
      name: 'MagSafe Dual-Axis Charging & Docking Stand',
      slug: 'magsafe-dual-axis-charging-stand',
      tagline: 'Weighted geometric desk dock with hidden silicone routing channel',
      description: 'Crafted with a monolithic 45-degree ergonomic viewing angle suitable for iPhone StandBy mode and desk conferencing. Contains a weighted internal steel-particle chamber preventing lift-off when retrieving device. Precision-toleranced for official Apple MagSafe pucks.',
      basePrice: 1199,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=80'
      ]),
      model3dType: 'stand',
      categoryId: categories['desk-workspace'].id,
      isAvailable: true,
      isFeatured: false,
      leadTimeDays: 2,
      materials: JSON.stringify(['Weighted Carbon-Fiber Infused PLA', 'Matte Architectural PLA']),
      colors: JSON.stringify([
        { name: 'Space Grey Matte', hex: '#374151' },
        { name: 'Graphite Black', hex: '#111827' },
        { name: 'Glacier White', hex: '#F3F4F6' }
      ]),
      dimensions: '95 x 85 x 120 mm',
      weight: '310g (Weighted Base)',
      customizationFields: JSON.stringify([
        {
          id: 'apple_watch_extension',
          name: 'apple_watch_extension',
          label: 'Integrated Apple Watch Charger Arm',
          type: 'radio',
          isRequired: true,
          options: [
            { label: 'Phone Only Stand', value: 'phone_only', priceModifier: 0 },
            { label: 'Dual Dock (Phone + Apple Watch)', value: 'dual_dock', priceModifier: 450 }
          ]
        },
        {
          id: 'monogram_initials',
          name: 'monogram_initials',
          label: 'Custom Monogram Initials (Up to 3 Letters)',
          type: 'text',
          placeholder: 'e.g. VK',
          isRequired: false,
          priceModifier: 120
        },
        {
          id: 'cable_clip_accent',
          name: 'cable_clip_accent',
          label: 'Accent Ring / Cable Clip Color',
          type: 'select',
          isRequired: false,
          options: [
            { label: 'Subtle Slate Gray', value: 'slate', priceModifier: 0 },
            { label: 'Safety Studio Amber Orange', value: 'amber', priceModifier: 50 },
            { label: 'Anodized Emerald Green', value: 'emerald', priceModifier: 50 }
          ]
        }
      ]),
    },
    {
      name: 'Custom 3D Lithophane Memory Lamp',
      slug: 'custom-3d-lithophane-memory-lamp',
      tagline: 'Sub-micron 0.08mm layer photographic relief lamp that reveals your photo when lit',
      description: 'A captivating fusion of high-precision additive manufacturing and personal memory. Using light thickness variations accurate down to 80 microns, your uploaded photograph is converted into a 3D topographic relief shell. Darker portions are printed thicker, casting photographic halftone gradients when the internal light is switched on.',
      basePrice: 1799,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80'
      ]),
      model3dType: 'lithophane',
      categoryId: categories['personalized-gifts'].id,
      isAvailable: true,
      isFeatured: true,
      leadTimeDays: 3,
      materials: JSON.stringify(['High-Purity Translucent Optical PLA', 'Artisan Hardwood Base']),
      colors: JSON.stringify([
        { name: 'Warm Cream Glow', hex: '#FFFBEB' },
        { name: 'Pure Studio White Glow', hex: '#FFFFFF' }
      ]),
      dimensions: '140 x 140 x 175 mm',
      weight: '290g',
      customizationFields: JSON.stringify([
        {
          id: 'photo_file_upload',
          name: 'photo_file_upload',
          label: 'Upload High-Res Photograph',
          type: 'file',
          isRequired: true,
          helpText: 'Upload clear portrait or couple photo (JPG, PNG). Our CAD engineers will optimize contrast.'
        },
        {
          id: 'lamp_geometry',
          name: 'lamp_geometry',
          label: 'Lithophane Display Geometry',
          type: 'select',
          isRequired: true,
          options: [
            { label: 'Curved Cinematic Panorama (180° Arc)', value: 'curved_arc', priceModifier: 0 },
            { label: 'Four-Sided Rotating Lantern (4 Photos Included)', value: 'lantern_4sided', priceModifier: 700 },
            { label: 'Moon Sphere Topographic Shell', value: 'moon_sphere', priceModifier: 500 }
          ]
        },
        {
          id: 'base_inscription',
          name: 'base_inscription',
          label: 'Engraved Date or Message on Base',
          type: 'text',
          placeholder: 'e.g. Always & Forever • 14.02.2025',
          isRequired: false,
          priceModifier: 150
        }
      ]),
    },
    {
      name: 'Modular Magnetic Honeycomb Desk Organizer',
      slug: 'modular-magnetic-honeycomb-organizer',
      tagline: 'Interlocking hexagonal workspace matrix with neodymium snap joints',
      description: 'An expandable desktop organization architecture with concealed rare-earth neodymium magnets along all six facets. Modules snap together in infinite configurations for stationery, digital styluses, SD cards, AirPods, USB keys, and succulent holders.',
      basePrice: 1699,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=1200&q=80'
      ]),
      model3dType: 'hex',
      categoryId: categories['functional-gadgets'].id,
      isAvailable: true,
      isFeatured: false,
      leadTimeDays: 2,
      materials: JSON.stringify(['Matte Engineering PLA', 'Recycled Composite PLA']),
      colors: JSON.stringify([
        { name: 'Architectural Charcoal & Warm Amber', hex: '#1F2937' },
        { name: 'Nordic Slate & Sage Green', hex: '#334155' },
        { name: 'Monochrome Sand & Matte White', hex: '#E2E8F0' }
      ]),
      dimensions: 'Each cell: 70 x 80 x 60 mm',
      weight: '340g (Set of 6)',
      customizationFields: JSON.stringify([
        {
          id: 'module_set_size',
          name: 'module_set_size',
          label: 'Modular Set Size',
          type: 'select',
          isRequired: true,
          options: [
            { label: 'Studio Starter Kit (6 Cells + 2 Planters)', value: '6_cells', priceModifier: 0 },
            { label: 'Creator Master Array (12 Cells + Phone Cradle)', value: '12_cells', priceModifier: 950 },
            { label: 'Executive Grid (18 Cells + Wireless Pad Module)', value: '18_cells', priceModifier: 1800 }
          ]
        },
        {
          id: 'magnetic_strength',
          name: 'magnetic_strength',
          label: 'Magnet Grade',
          type: 'radio',
          isRequired: true,
          options: [
            { label: 'Standard N35 Neodymium (Smooth Repositioning)', value: 'n35', priceModifier: 0 },
            { label: 'Heavy-Duty N52 Neodymium (Ultra-Firm Lock)', value: 'n52', priceModifier: 200 }
          ]
        }
      ]),
    },
    {
      name: 'Custom Topographic Resin Artisan Keycap Set',
      slug: 'topographic-resin-artisan-keycaps',
      tagline: '8K DLP resin cast keycaps with contoured contour-line relief',
      description: 'Engineered for bespoke mechanical keyboard connoisseurs. Modeled after real Himalayan topographical elevation contours with microscopic stepped terraces. Standard MX-stem compatible with frosted translucent light-bleed underglow.',
      basePrice: 999,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1200&q=80'
      ]),
      model3dType: 'keycap',
      categoryId: categories['functional-gadgets'].id,
      isAvailable: true,
      isFeatured: false,
      leadTimeDays: 2,
      materials: JSON.stringify(['8K Photopolymer Tough Resin', 'Hand-Polished Acrylic Sealant']),
      colors: JSON.stringify([
        { name: 'Onyx Smoke & Gold Foil', hex: '#171717' },
        { name: 'Glacial Clear & Cyber Cyan', hex: '#06B6D4' },
        { name: 'Sunset Terracotta & Copper', hex: '#EA580C' }
      ]),
      dimensions: '18 x 18 x 12 mm (Cherry Profile)',
      weight: '8g',
      customizationFields: JSON.stringify([
        {
          id: 'key_profile',
          name: 'key_profile',
          label: 'Keyboard Key Profile',
          type: 'select',
          isRequired: true,
          options: [
            { label: 'Cherry Profile (Row 1 / ESC)', value: 'cherry_r1', priceModifier: 0 },
            { label: 'OEM Profile (Row 1 / ESC)', value: 'oem_r1', priceModifier: 0 },
            { label: 'SA High-Sculpted Profile', value: 'sa_r1', priceModifier: 150 },
            { label: 'Spacebar (6.25u Contour Edition)', value: 'spacebar_625', priceModifier: 850 }
          ]
        },
        {
          id: 'foil_inlay',
          name: 'foil_inlay',
          label: 'Metallic Foil Inlay in Resin',
          type: 'radio',
          isRequired: true,
          options: [
            { label: '24K Gold Leaf Flakes', value: 'gold_flakes', priceModifier: 100 },
            { label: 'Holographic Silver Foil', value: 'holo_silver', priceModifier: 80 },
            { label: 'Pure Crystalline (No Inlay)', value: 'pure', priceModifier: 0 }
          ]
        }
      ]),
    },
    {
      name: 'Parametric Faceted Self-Watering Planter',
      slug: 'parametric-faceted-planter',
      tagline: 'Algorithmic geometric succulent vessel crafted with natural wood-fiber polymer',
      description: 'Manufactured from 40% pulverized natural pinewood and 60% biopolymer filament, this planter smells faintly of fresh pine and can be sanded, stained, or left natural. Includes a concealed sub-irrigation water reservoir with cotton wick delivery for low-maintenance indoor flora.',
      basePrice: 899,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=1200&q=80'
      ]),
      model3dType: 'planter',
      categoryId: categories['home-decor-lighting'].id,
      isAvailable: true,
      isFeatured: false,
      leadTimeDays: 2,
      materials: JSON.stringify(['Pine Wood Fiber Biocomposite', 'Stone-Filled Basalt PLA', 'Pure White Matte']),
      colors: JSON.stringify([
        { name: 'Natural Sanded Oak Wood', hex: '#D7A86E' },
        { name: 'Dark Walnut Stain', hex: '#582F0E' },
        { name: 'Granite Stone Grey', hex: '#78716C' }
      ]),
      dimensions: '140 x 140 x 125 mm',
      weight: '230g',
      customizationFields: JSON.stringify([
        {
          id: 'planter_size',
          name: 'planter_size',
          label: 'Planter Diameter',
          type: 'select',
          isRequired: true,
          options: [
            { label: 'Desktop Succulent (10 cm diameter)', value: '10cm', priceModifier: 0 },
            { label: 'Medium Bonsai / Pothos (16 cm diameter)', value: '16cm', priceModifier: 350 },
            { label: 'Statement Floor Vessel (24 cm diameter)', value: '24cm', priceModifier: 850 }
          ]
        },
        {
          id: 'drainage_system',
          name: 'drainage_system',
          label: 'Drainage & Reservoir Type',
          type: 'radio',
          isRequired: true,
          options: [
            { label: 'Self-Watering Sub-Irrigation Reservoir with Wick', value: 'self_watering', priceModifier: 150 },
            { label: 'Traditional Open Drainage + Matching Saucer Plate', value: 'matching_saucer', priceModifier: 80 },
            { label: 'Solid Sealed Interior (For Artificial Plants)', value: 'sealed', priceModifier: 0 }
          ]
        }
      ]),
    }
  ];

  const createdProducts = [];
  for (const prod of products) {
    const created = await prisma.product.create({ data: prod });
    createdProducts.push(created);
  }
  console.log(`✓ Created ${createdProducts.length} products`);

  // Create Reviews
  const reviewsData = [
    {
      productId: createdProducts[0].id,
      userId: customer.id,
      authorName: 'Aarav Sharma',
      rating: 5,
      reviewText: 'The quality on the Articulated Cybernetic Dragon is breathtaking. The co-extruded colors shift seamlessly from purple to gold as you rotate it. No rough layer lines anywhere, and the joints glide effortlessly without squeaking. Worth every rupee.',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      isPublished: true,
      isVerifiedPurchase: true,
    },
    {
      productId: createdProducts[0].id,
      userId: null,
      authorName: 'Dr. Meera Nambiar',
      rating: 5,
      reviewText: 'Ordered the Grand 55cm edition for my husband’s design studio desk. He was completely mesmerized. The packaging was immaculate with bubble wrap and protective casing. VK Studio is redefining 3D printing in India.',
      imageUrl: null,
      isPublished: true,
      isVerifiedPurchase: true,
    },
    {
      productId: createdProducts[1].id,
      userId: null,
      authorName: 'Kunal Singhania',
      rating: 5,
      reviewText: 'The Voronoi lamp casts the most mesmerizing organic shadows on our living room ceiling. The touch-dimmer works smoothly and the walnut wood ring gives it a true Scandinavian designer feel.',
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
      isPublished: true,
      isVerifiedPurchase: true,
    },
    {
      productId: createdProducts[2].id,
      userId: customer.id,
      authorName: 'Aarav Sharma',
      rating: 5,
      reviewText: 'Got the architectural nameplate for my cabin. The brushed gold extruded letters on the matte basalt look like a 5-figure architectural installation. Everyone who walks into my office asks where I got it.',
      imageUrl: null,
      isPublished: true,
      isVerifiedPurchase: true,
    },
    {
      productId: createdProducts[4].id,
      userId: null,
      authorName: 'Sneha & Rohan',
      rating: 5,
      reviewText: 'Ordered the lithophane lamp with our wedding photo for our 1st anniversary. When the light turned on, we literally got goosebumps. Every detail of the lace dress and our smiles is crystal clear. Outstanding work, VK Studio!',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80',
      isPublished: true,
      isVerifiedPurchase: true,
    },
    {
      productId: createdProducts[3].id,
      userId: null,
      authorName: 'Rishi Varma',
      rating: 4,
      reviewText: 'Very solid and stable MagSafe stand. The weighted base means you can snatch your phone with one hand and the stand doesn’t budget at all. The amber accent ring looks sharp.',
      imageUrl: null,
      isPublished: true,
      isVerifiedPurchase: true,
    }
  ];

  for (const rev of reviewsData) {
    await prisma.review.create({ data: rev });
  }
  console.log(`✓ Created ${reviewsData.length} authentic customer reviews`);

  // Create Sample Customization Request
  const sampleRequest = await prisma.customizationRequest.create({
    data: {
      referenceNumber: 'CR-2026-7841',
      userId: customer.id,
      customerName: 'Aarav Sharma',
      customerEmail: 'customer@vkstudio.com',
      customerPhone: '+91 98112 34567',
      productId: createdProducts[2].id,
      productTitle: 'Architectural Dual-Layer Studio Nameplate',
      customizationDetails: JSON.stringify({
        custom_full_name: 'AARAV SHARMA & ASSOCIATES',
        custom_subtitle: 'SUSTAINABLE ARCHITECTURE & INTERIORS',
        typography_font: 'Modern Bauhaus Geometric Sans',
        accent_inlay_finish: 'Silk Champagne Gold',
        size: 'Custom 300mm length'
      }),
      customerInstructions: 'Need custom wall-mounting brackets instead of desk stand if possible. Also please ensure letter height is at least 22mm.',
      referenceFileUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      quantity: 2,
      estimatedPrice: 2898,
      finalQuote: 3100,
      status: 'QUOTE_SENT',
      adminNotes: 'Checked CAD dimensions. Extra bracket tolerance added. Sliced with 0.12mm layer height in Carbon Black.',
      adminResponse: 'Hello Aarav, we have created custom wall standoffs for your plaques. Slicing estimate is 36 hours. Quote updated to ₹3,100 including mounting hardware.',
    },
  });
  console.log('✓ Created Sample Customization Request');

  // Create Sample Order
  const sampleOrder = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2026-1042',
      userId: customer.id,
      customerName: 'Aarav Sharma',
      customerEmail: 'customer@vkstudio.com',
      customerPhone: '+91 98112 34567',
      shippingAddress: 'Flat 402, Skyline Residency, 100ft Road, Indiranagar',
      city: 'Bengaluru',
      postalCode: '560038',
      state: 'Karnataka',
      subtotal: 2149,
      shippingFee: 0,
      totalAmount: 2149,
      paymentMethod: 'DIRECT_UPI',
      paymentStatus: 'PAID',
      productionStatus: 'IN_PRODUCTION',
      trackingNumber: 'VK-DTDC-88912',
      courier: 'DTDC Express Courier',
      customerNotes: 'Please pack securely as it is a birthday gift.',
      adminNotes: 'Bambu Lab X1 Carbon print plate #3. ETA completion: tomorrow 4 PM.',
      items: {
        create: [
          {
            productId: createdProducts[0].id,
            productName: 'Articulated Cybernetic Dragon',
            productImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
            unitPrice: 1499,
            customizationPrice: 650,
            quantity: 1,
            totalPrice: 2149,
            customizationDetails: JSON.stringify({
              size_variant: 'Grand Exhibit Edition (55 cm) (+₹650)',
              horn_style: 'Imperial Crown Horns',
              eye_accent: 'Ruby Crimson Red',
              pedestal_inscription: 'For Vikram - 2026'
            })
          }
        ]
      }
    }
  });
  console.log('✓ Created Sample Order');

  // Create Website Settings
  const defaultSettings = {
    brandName: 'VK STUDIO',
    tagline: 'Premium 3D Printing & Bespoke Customization Studio by Vamsi Krishna',
    heroHeadline: 'Your Imagination. Our Creation.',
    heroSubheadline: 'Discover thoughtfully engineered 3D-printed masterpieces or bring your bespoke ideas to life with state-of-the-art precision customization from VK STUDIO by Vamsi Krishna.',
    heroBadge: 'Precision FDM & SLA Resin Fabrication',
    aboutTitle: 'Craftsmanship Meets High-Precision Additive Manufacturing',
    aboutDescription: 'VK STUDIO was founded by Vamsi Krishna with a single mission: bridging bespoke artisanal design with industrial-grade 3D printing technology. Every piece is carefully sliced, monitored across hundreds of micro-layers, hand-finished, and curated to perfection in our studio.',
    whatsappNumber: '+91 98765 43210',
    instagramUrl: 'https://instagram.com/vk_studi_o',
    contactEmail: 'contact@vkstudio.design',
    contactPhone: '+91 98765 43210',
    studioAddress: 'VK Studio, Bengaluru, Karnataka, India',
    workingHours: 'Monday – Saturday: 10:00 AM – 8:00 PM IST',
    announcementText: '✨ Accepting Custom Commissions & Bulk Orders — Follow @vk_studi_o on Instagram!',
    showAnnouncement: true,
  };

  await prisma.websiteSetting.create({
    data: {
      key: 'general_settings',
      value: JSON.stringify(defaultSettings),
    },
  });
  console.log('✓ Created Website Settings');

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
