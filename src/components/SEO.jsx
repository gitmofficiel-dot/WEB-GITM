import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SEO({
  title = 'GITM | Groupe Innovation Technologique Maroc',
  description = 'المنصة الوطنية للابتكار التكنولوجي والذكاء الاصطناعي بالمغرب - Groupe Innovation Technologique Maroc',
  keywords = 'GITM, Groupe Innovation Technologique Maroc, الذكاء الاصطناعي, إنترنت الأشياء, الأنظمة المدمجة, المغرب',
  image = 'https://gitm.pages.dev/logo.png',
  type = 'website',
  schema = null
}) {
  const location = useLocation();
  const canonicalUrl = `https://gitm.pages.dev${location.pathname === '/' ? '' : location.pathname}`;

  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Helper to set or create meta tag
    const setMetaTag = (attribute, attrValue, content) => {
      let element = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 3. Primary Meta Tags
    setMetaTag('name', 'title', title);
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);

    // 4. OpenGraph Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', type);

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);
    setMetaTag('name', 'twitter:url', canonicalUrl);

    // 6. Canonical Link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 7. JSON-LD Schema
    let schemaScript = document.querySelector('script[id="json-ld-schema"]');
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('type', 'application/ld+json');
        schemaScript.setAttribute('id', 'json-ld-schema');
        document.head.appendChild(schemaScript);
      }
      schemaScript.innerHTML = JSON.stringify(schema);
    } else if (schemaScript) {
      schemaScript.remove();
    }

  }, [title, description, keywords, image, type, canonicalUrl, schema]);

  return null;
}
