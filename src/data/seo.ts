export const siteOrigin = "https://willchai.com";
export const person = {
  "@type": "Person", "@id": `${siteOrigin}/#person`, name: "William Chai", alternateName: "Will Chai",
  url: `${siteOrigin}/`, sameAs: ["https://www.linkedin.com/in/willchai/"],
};
export function pageSchema(path: string, title: string, description: string, image?: string) {
  const url = new URL(path, siteOrigin).href;
  const names: Record<string, string> = { films: "Films", projects: "Projects", photography: "Photography", resume: "Résumé" };
  const parts = path.split("/").filter(Boolean);
  const parent = parts.length > 1 && names[parts[0]] ? { "@type": "ListItem", position: 2, name: names[parts[0]], item: `${siteOrigin}/${parts[0]}/` } : undefined;
  return { "@context": "https://schema.org", "@graph": [person,
    { "@type": path === "/resume/" ? "ProfilePage" : "WebPage", "@id": `${url}#page`, url, name: title, description,
      inLanguage: "en-CA", isPartOf: { "@id": `${siteOrigin}/#website` }, about: { "@id": person["@id"] },
      ...(path === "/resume/" ? { mainEntity: { "@id": person["@id"] } } : {}),
      ...(image ? { primaryImageOfPage: { "@type": "ImageObject", url: new URL(image, siteOrigin).href } } : {}) },
    { "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Will Chai", item: `${siteOrigin}/` },
      ...(parent ? [parent] : []),
      { "@type": "ListItem", position: parent ? 3 : 2, name: title.split(" | ")[0], item: url },
    ] },
  ] };
}
