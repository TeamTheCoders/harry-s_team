import { sql } from '@/lib/db/client';

// SiteSettings model
export interface SiteSettings {
  id: string;
  siteTitle?: string;
  siteDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  updatedAt: string;
}

// Function to get site settings
export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  try {
    const result = await sql`
      SELECT
        id,
        site_title AS siteTitle,
        site_description AS siteDescription,
        contact_email AS contactEmail,
        contact_phone AS contactPhone,
        address,
        updated_at AS updatedAt
      FROM site_settings
      ORDER BY updated_at DESC
      LIMIT 1
    ` as SiteSettings[];
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
};

// Function to update site settings
export const updateSiteSettings = async (settings: Partial<SiteSettings>): Promise<SiteSettings | null> => {
  try {
    // Get the current settings
    const currentSettings = await getSiteSettings();

    if (currentSettings) {
      // Update existing settings
      const result = await sql`
        UPDATE site_settings
        SET
          site_title = COALESCE(${settings.siteTitle}, site_title),
          site_description = COALESCE(${settings.siteDescription}, site_description),
          contact_email = COALESCE(${settings.contactEmail}, contact_email),
          contact_phone = COALESCE(${settings.contactPhone}, contact_phone),
          address = COALESCE(${settings.address}, address),
          updated_at = NOW()
        WHERE id = ${currentSettings.id}
        RETURNING
          id,
          site_title AS siteTitle,
          site_description AS siteDescription,
          contact_email AS contactEmail,
          contact_phone AS contactPhone,
          address,
          updated_at AS updatedAt
      ` as SiteSettings[];
      return result.length > 0 ? result[0] : null;
    } else {
      // Create new settings
      const result = await sql`
        INSERT INTO site_settings (site_title, site_description, contact_email, contact_phone, address)
        VALUES (${settings.siteTitle}, ${settings.siteDescription}, ${settings.contactEmail}, ${settings.contactPhone}, ${settings.address})
        RETURNING
          id,
          site_title AS siteTitle,
          site_description AS siteDescription,
          contact_email AS contactEmail,
          contact_phone AS contactPhone,
          address,
          updated_at AS updatedAt
      ` as SiteSettings[];
      return result.length > 0 ? result[0] : null;
    }
  } catch (error) {
    console.error('Error updating site settings:', error);
    return null;
  }
};