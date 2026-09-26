import { supabase } from "../lib/supabase";

// ------------------------------------
// PREFERENCES
// ------------------------------------

export async function savePreferences(userId, preferences) {
  const { data, error } = await supabase
    .from("preferences")
    .upsert(
      {
        user_id: userId,
        skin_type: preferences.skinType,
        preferred_look: preferences.preferredLook,
        budget_range: preferences.budgetRange,
        preferred_brands: preferences.preferredBrands,
      },
      {
        onConflict: "user_id",
      }
    )
    .select()
    .single();

  if (error) {
    console.error("Error saving preferences:", error);
    throw error;
  }

  return data;
}

export async function getPreferences(userId) {
  const { data, error } = await supabase
    .from("preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Error loading preferences:", error);
    throw error;
  }

  return data;
}

// ------------------------------------
// SKIN ANALYSIS
// ------------------------------------

export async function saveSkinAnalysis(userId, analysis) {
  const { data, error } = await supabase
    .from("skin_analyses")
    .insert({
      user_id: userId,
      skin_tone: analysis.skinTone,
      undertone: analysis.undertone,
      skin_depth: analysis.skinDepth,
      best_shade_range: analysis.bestShadeRange,
      analysis_data: analysis.analysisData || {},
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving skin analysis:", error);
    throw error;
  }

  return data;
}

export async function getLatestSkinAnalysis(userId) {
  const { data, error } = await supabase
    .from("skin_analyses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error loading skin analysis:", error);
    throw error;
  }

  return data;
}

// ------------------------------------
// SAVED PRODUCTS / KIT
// ------------------------------------

export async function saveProduct(userId, product) {
  const { data, error } = await supabase
    .from("saved_products")
    .upsert(
      {
        user_id: userId,
        product_id: String(product.id),
        product_name: product.name,
        brand: product.brand,
        category: product.category,
        shade: product.shade,
        price: product.price,
        image_url: product.imageUrl,
      },
      {
        onConflict: "user_id,product_id",
      }
    )
    .select()
    .single();

  if (error) {
    console.error("Error saving product:", error);
    throw error;
  }

  return data;
}

export async function getSavedProducts(userId) {
  const { data, error } = await supabase
    .from("saved_products")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading saved products:", error);
    throw error;
  }

  return data || [];
}

export async function deleteSavedProduct(userId, productId) {
  const { error } = await supabase
    .from("saved_products")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", String(productId));

  if (error) {
    console.error("Error deleting saved product:", error);
    throw error;
  }
}