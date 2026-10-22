// Photo sets for the drifting hero carousels, one set per page so no two
// heroes look alike. Services and Shop use their own catalogue photos.
// Remote photos come from Unsplash (free to use under the Unsplash License).

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&h=960&q=72`;

export const heroSlides: Record<string, string[]> = {
  // Urban balconies, terraces and green facades
  '/': [
    unsplash('1486484290742-0ce4eb743a34'),
    unsplash('1687960650778-35ab8f1a797e'),
    unsplash('1616422271481-036413161a51'),
    unsplash('1758194403765-6791170a6a65'),
    unsplash('1780053906696-325413e4cc19'),
    unsplash('1767045572576-4e550983b89b'),
  ],
  // Recurring care: hedges, lawns, offices
  '/plans': [
    unsplash('1774579893308-ec777199ce32'),
    unsplash('1734303023491-db8037a21f09'),
    unsplash('1642541744624-7a2a89545a32'),
    unsplash('1700809888987-cf2b29ecbd2c'),
    unsplash('1779888793240-898dec4b9c08'),
    unsplash('1788601716510-c779644390ec'),
  ],
  // City rooftops and green buildings
  '/check-area': [
    unsplash('1769690093863-4f2a3fd17dd2'),
    unsplash('1712153191094-50682c5bea14'),
    unsplash('1784878281083-58f3f8e6d5ab'),
    unsplash('1769690093823-eab878c82646'),
    unsplash('1634161382704-fa206c85f3d6'),
    unsplash('1758193431353-87812fbff5cd'),
  ],
  // The people behind the plants
  '/about': [
    unsplash('1759497860802-9cba5782b455'),
    unsplash('1728706613021-e447801e1ea6'),
    unsplash('1785153263679-4affe6753a3e'),
    unsplash('1615346832334-23e27e819c0d'),
    unsplash('1783191690538-689b5b339884'),
    unsplash('1557348959-b081033fb6ef'),
  ],
  // Finished gardens, patios and interiors
  '/portfolio': [
    unsplash('1617850687395-620757feb1f3'),
    unsplash('1788398913509-89f16ab3ab9c'),
    unsplash('1770459907739-22dd5aec9cce'),
    unsplash('1786348521420-e9045e5d9263'),
    unsplash('1743327811352-8f9b286f9c12'),
    unsplash('1718220268527-4477fd170775'),
  ],
  // Nurseries and greenhouses
  '/partner': [
    unsplash('1758524056619-4ddb32d18c8a'),
    unsplash('1619077130450-baea09efa355'),
    unsplash('1653842647601-c84c4ce6f9fe'),
    unsplash('1758524056749-9119981fc961'),
    unsplash('1619077071446-f10b627f8aaa'),
    unsplash('1759032199417-0830d89f3768'),
  ],
  // Watering cans, tools and hands in soil
  '/contact': [
    unsplash('1515150144380-bca9f1650ed9'),
    unsplash('1523301551780-cd17359a95d0'),
    unsplash('1673853233647-17ebc2d71b5f'),
    unsplash('1763856957026-a74ab4f05891'),
    unsplash('1788014956391-21dea41215c4'),
    unsplash('1526381805515-3fec2d69e7cc'),
  ],
  // Legal pages: calm foliage, a different set each
  '/privacy-policy': [
    unsplash('1585328000852-779be6a6582b'),
    unsplash('1535242208474-9a2793260ca8'),
    unsplash('1518531933037-91b2f5f229cc'),
    unsplash('1555037015-1498966bcd7c'),
    unsplash('1536147116438-62679a5e01f2'),
    unsplash('1609769274404-a603c8e97b68'),
  ],
  '/terms': [
    unsplash('1525498128493-380d1990a112'),
    unsplash('1636525653613-2a3a05c00759'),
    unsplash('1585598117002-9fb152e67dbf'),
    unsplash('1493673272479-a20888bcee10'),
    unsplash('1604866830513-d54766457f45'),
    unsplash('1614594975525-e45190c55d0b'),
  ],
  '/cancellation-refund': [
    unsplash('1459411552884-841db9b3cc2a'),
    unsplash('1485955900006-10f4d324d411'),
    unsplash('1463320898484-cdee8141c787'),
    unsplash('1592059030877-831ebfd69de7'),
    unsplash('1459156212016-c812468e2115'),
    unsplash('1447012256906-c2ed7aa5632e'),
  ],
  '/service-terms': [
    unsplash('1686100510540-4c29a46de6e9'),
    unsplash('1594235046256-90e5572fd5f9'),
    unsplash('1745970347554-854e886c5685'),
    unsplash('1600636215933-960336b2c3f2'),
    unsplash('1589109528868-ea1060647062'),
    unsplash('1784316395323-379f0b67b97e'),
  ],
};

export const getHeroSlides = (path: string, fallback: string[] = heroSlides['/']) =>
  heroSlides[path] || fallback;
