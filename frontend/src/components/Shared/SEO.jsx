import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogTitle,
  ogDescription,
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  twitterImage,
}) => {
  const siteTitle = "KeepAlive - Website Uptime Monitoring";
  const defaultDescription =
    "Monitor your website's uptime and get instant notifications when your site goes down.";
  const defaultKeywords =
    "website monitoring, uptime monitoring, website status, server monitoring, website alerts";
  const defaultImage = "/images/og-image.jpg"; // You'll need to add this image to your public folder

  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaOgImage = ogImage || defaultImage;
  const metaOgTitle = ogTitle || fullTitle;
  const metaOgDescription = ogDescription || metaDescription;
  const metaTwitterTitle = twitterTitle || fullTitle;
  const metaTwitterDescription = twitterDescription || metaDescription;
  const metaTwitterImage = twitterImage || defaultImage;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={metaOgTitle} />
      <meta property="og:description" content={metaOgDescription} />
      <meta property="og:image" content={metaOgImage} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={metaTwitterTitle} />
      <meta name="twitter:description" content={metaTwitterDescription} />
      <meta name="twitter:image" content={metaTwitterImage} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#1a1a1a" />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
};

export default SEO;
