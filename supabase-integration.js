// Supabase Vanilla JavaScript Integration
// Replace with your actual Supabase credentials

const SUPABASE_URL = 'https://mcvhhikrlefdoxxodmsa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jdmhoaWtybGVmZG94eG9kbXNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0MDk1NTEsImV4cCI6MjA3MTk4NTU1MX0.JCLLFKlqWTlHzGrd3svcxXWtwJLjiG0D5hOsL4w9Llo';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global state
let currentUser = null;
let currentSession = null;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function showError(message) {
  console.error('Error:', message);
  // You can replace this with your own error display logic
  alert('Error: ' + message);
}

function showSuccess(message) {
  console.log('Success:', message);
  // You can replace this with your own success display logic
}

// =============================================================================
// AUTHENTICATION FUNCTIONS
// =============================================================================

// Initialize auth state
async function initAuth() {
  try {
    // Get current session
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    currentSession = session;
    currentUser = session?.user || null;
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      currentSession = session;
      currentUser = session?.user || null;
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', currentUser);
        onAuthStateChanged(true);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        onAuthStateChanged(false);
      }
    });
    
    if (currentUser) {
      onAuthStateChanged(true);
    }
  } catch (error) {
    showError(error.message);
  }
}

// Admin login
async function adminLogin(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Check if user is an admin
    const { data: adminProfile, error: adminError } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', data.user.id)
      .single();
    
    if (adminError && adminError.code !== 'PGRST116') throw adminError;
    
    if (!adminProfile) {
      await supabase.auth.signOut();
      throw new Error('Access denied. Admin privileges required.');
    }
    
    showSuccess('Admin logged in successfully');
    return { user: data.user, profile: adminProfile };
  } catch (error) {
    showError(error.message);
    return { error: error.message };
  }
}

// Admin signup
async function adminSignup(email, password, name) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        },
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) throw error;
    
    showSuccess('Admin account created. Please check your email for verification.');
    return { user: data.user };
  } catch (error) {
    showError(error.message);
    return { error: error.message };
  }
}

// Logout
async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    showSuccess('Logged out successfully');
  } catch (error) {
    showError(error.message);
  }
}

// Check if user is authenticated admin
function isAuthenticatedAdmin() {
  return currentUser && currentSession;
}

// Callback for auth state changes (customize this)
function onAuthStateChanged(isLoggedIn) {
  // Update your UI based on authentication status
  console.log('Auth state changed:', isLoggedIn);
  
  // Example: Show/hide admin panels
  const adminElements = document.querySelectorAll('.admin-only');
  adminElements.forEach(el => {
    el.style.display = isLoggedIn ? 'block' : 'none';
  });
}

// =============================================================================
// PRODUCTS CRUD OPERATIONS
// =============================================================================

// Get all products
async function getProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    showError(error.message);
    return [];
  }
}

// Get single product
async function getProduct(id) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    showError(error.message);
    return null;
  }
}

// Add product
async function addProduct(productData) {
  try {
    if (!isAuthenticatedAdmin()) {
      throw new Error('Admin authentication required');
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    
    if (error) throw error;
    
    showSuccess('Product added successfully');
    return data;
  } catch (error) {
    showError(error.message);
    return null;
  }
}

// Update product
async function updateProduct(id, updates) {
  try {
    if (!isAuthenticatedAdmin()) {
      throw new Error('Admin authentication required');
    }
    
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    showSuccess('Product updated successfully');
    return data;
  } catch (error) {
    showError(error.message);
    return null;
  }
}

// Delete product
async function deleteProduct(id) {
  try {
    if (!isAuthenticatedAdmin()) {
      throw new Error('Admin authentication required');
    }
    
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    showSuccess('Product deleted successfully');
    return true;
  } catch (error) {
    showError(error.message);
    return false;
  }
}

// =============================================================================
// ORDERS OPERATIONS
// =============================================================================

// Get all orders
async function getOrders() {
  try {
    if (!isAuthenticatedAdmin()) {
      throw new Error('Admin authentication required');
    }
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    showError(error.message);
    return [];
  }
}

// Create order
async function createOrder(orderData, orderItems) {
  try {
    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Insert order items
    const itemsWithOrderId = orderItems.map(item => ({
      ...item,
      order_id: order.id
    }));
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);
    
    if (itemsError) throw itemsError;
    
    showSuccess('Order created successfully');
    return order;
  } catch (error) {
    showError(error.message);
    return null;
  }
}

// Update order status
async function updateOrderStatus(orderId, status, paymentStatus = null) {
  try {
    if (!isAuthenticatedAdmin()) {
      throw new Error('Admin authentication required');
    }
    
    const updates = { status };
    if (paymentStatus) {
      updates.payment_status = paymentStatus;
    }
    
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    
    showSuccess('Order status updated successfully');
    return data;
  } catch (error) {
    showError(error.message);
    return null;
  }
}

// =============================================================================
// WEBSITE SETTINGS OPERATIONS
// =============================================================================

// Get website settings
async function getWebsiteSettings() {
  try {
    const { data, error } = await supabase
      .from('website_settings')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    
    return data || {};
  } catch (error) {
    showError(error.message);
    return {};
  }
}

// Update website settings
async function updateWebsiteSettings(settings) {
  try {
    if (!isAuthenticatedAdmin()) {
      throw new Error('Admin authentication required');
    }
    
    // Check if settings exist
    const { data: existing } = await supabase
      .from('website_settings')
      .select('id')
      .limit(1)
      .single();
    
    let result;
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('website_settings')
        .update(settings)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    } else {
      // Insert new
      const { data, error } = await supabase
        .from('website_settings')
        .insert([settings])
        .select()
        .single();
      
      if (error) throw error;
      result = data;
    }
    
    showSuccess('Website settings updated successfully');
    return result;
  } catch (error) {
    showError(error.message);
    return null;
  }
}

// =============================================================================
// SOCIAL MEDIA OPERATIONS
// =============================================================================

// Get social media links
async function getSocialMediaLinks() {
  try {
    const { data, error } = await supabase
      .from('social_media')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    showError(error.message);
    return [];
  }
}

// Add social media link
async function addSocialMediaLink(linkData) {
  try {
    if (!isAuthenticatedAdmin()) {
      throw new Error('Admin authentication required');
    }
    
    const { data, error } = await supabase
      .from('social_media')
      .insert([linkData])
      .select()
      .single();
    
    if (error) throw error;
    
    showSuccess('Social media link added successfully');
    return data;
  } catch (error) {
    showError(error.message);
    return null;
  }
}

// Update social media link
async function updateSocialMediaLink(id, updates) {
  try {
    if (!isAuthenticatedAdmin()) {
      throw new Error('Admin authentication required');
    }
    
    const { data, error } = await supabase
      .from('social_media')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    showSuccess('Social media link updated successfully');
    return data;
  } catch (error) {
    showError(error.message);
    return null;
  }
}

// Delete social media link
async function deleteSocialMediaLink(id) {
  try {
    if (!isAuthenticatedAdmin()) {
      throw new Error('Admin authentication required');
    }
    
    const { error } = await supabase
      .from('social_media')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    showSuccess('Social media link deleted successfully');
    return true;
  } catch (error) {
    showError(error.message);
    return false;
  }
}

// =============================================================================
// REAL-TIME SUBSCRIPTIONS
// =============================================================================

let subscriptions = [];

// Subscribe to products changes
function subscribeToProducts(callback) {
  const subscription = supabase
    .channel('products_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'products'
      },
      (payload) => {
        console.log('Products change:', payload);
        if (callback) callback(payload);
      }
    )
    .subscribe();
  
  subscriptions.push(subscription);
  return subscription;
}

// Subscribe to orders changes
function subscribeToOrders(callback) {
  if (!isAuthenticatedAdmin()) {
    console.warn('Admin authentication required for orders subscription');
    return null;
  }
  
  const subscription = supabase
    .channel('orders_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders'
      },
      (payload) => {
        console.log('Orders change:', payload);
        if (callback) callback(payload);
      }
    )
    .subscribe();
  
  subscriptions.push(subscription);
  return subscription;
}

// Subscribe to website settings changes
function subscribeToWebsiteSettings(callback) {
  const subscription = supabase
    .channel('website_settings_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'website_settings'
      },
      (payload) => {
        console.log('Website settings change:', payload);
        if (callback) callback(payload);
      }
    )
    .subscribe();
  
  subscriptions.push(subscription);
  return subscription;
}

// Subscribe to social media changes
function subscribeToSocialMedia(callback) {
  const subscription = supabase
    .channel('social_media_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'social_media'
      },
      (payload) => {
        console.log('Social media change:', payload);
        if (callback) callback(payload);
      }
    )
    .subscribe();
  
  subscriptions.push(subscription);
  return subscription;
}

// Unsubscribe from a specific subscription
function unsubscribe(subscription) {
  if (subscription) {
    supabase.removeChannel(subscription);
    subscriptions = subscriptions.filter(sub => sub !== subscription);
  }
}

// Unsubscribe from all subscriptions
function unsubscribeAll() {
  subscriptions.forEach(subscription => {
    supabase.removeChannel(subscription);
  });
  subscriptions = [];
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  initAuth();
});

// Export functions to global scope
window.SupabaseIntegration = {
  // Auth functions
  adminLogin,
  adminSignup,
  logout,
  isAuthenticatedAdmin,
  
  // Products functions
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  
  // Orders functions
  getOrders,
  createOrder,
  updateOrderStatus,
  
  // Website settings functions
  getWebsiteSettings,
  updateWebsiteSettings,
  
  // Social media functions
  getSocialMediaLinks,
  addSocialMediaLink,
  updateSocialMediaLink,
  deleteSocialMediaLink,
  
  // Real-time functions
  subscribeToProducts,
  subscribeToOrders,
  subscribeToWebsiteSettings,
  subscribeToSocialMedia,
  unsubscribe,
  unsubscribeAll,
  
  // Utility functions
  showError,
  showSuccess,
  
  // Direct access to Supabase client
  supabase
};

console.log('Supabase integration loaded successfully!');
