/**
 * Admin Privilege & Authentication Controller
 * Enforces strict role-based access control (RBAC):
 * Only authorized Email: dksacademy.live@gmail.com OR Mobile: 7045377303 has admin privileges.
 * Public/normal visitors are denied access.
 */

export const AUTHORIZED_ADMIN = {
  email: 'dksacademy.live@gmail.com',
  mobile: '7045377303',
  name: 'मुख्य व्यवस्थापक (Super Admin)',
};

export interface PrivilegeCheckResult {
  isAuthorized: boolean;
  cleanIdentifier: string;
  type: 'email' | 'mobile' | 'unauthorized';
  message: string;
}

/**
 * Validates if the given email or phone number has Admin privileges.
 */
export function checkAdminPrivilege(identifier: string): PrivilegeCheckResult {
  if (!identifier || !identifier.trim()) {
    return {
      isAuthorized: false,
      cleanIdentifier: '',
      type: 'unauthorized',
      message: 'कृपया अपना अधिकृत एडमिन ईमेल या मोबाइल नंबर दर्ज करें।',
    };
  }

  const raw = identifier.trim().toLowerCase();

  // 1. Match Email
  if (raw === AUTHORIZED_ADMIN.email.toLowerCase()) {
    return {
      isAuthorized: true,
      cleanIdentifier: AUTHORIZED_ADMIN.email,
      type: 'email',
      message: 'अधिकृत एडमिन ईमेल मान्य (Authorized Admin Email Verified)',
    };
  }

  // 2. Match Mobile Number
  const digitsOnly = raw.replace(/[^0-9]/g, '');
  if (
    digitsOnly === AUTHORIZED_ADMIN.mobile ||
    digitsOnly === `91${AUTHORIZED_ADMIN.mobile}` ||
    digitsOnly === `0${AUTHORIZED_ADMIN.mobile}`
  ) {
    return {
      isAuthorized: true,
      cleanIdentifier: AUTHORIZED_ADMIN.mobile,
      type: 'mobile',
      message: 'अधिकृत एडमिन मोबाइल नंबर मान्य (Authorized Admin Mobile Verified)',
    };
  }

  // Any other email or number is DENIED
  return {
    isAuthorized: false,
    cleanIdentifier: identifier.trim(),
    type: 'unauthorized',
    message:
      'एक्सेस अस्वीकृत (Access Denied): आपके पास एडमिन प्रिविलेज नहीं हैं। यह कंट्रोल पैनल केवल अधिकृत ईमेल (dksacademy.live@gmail.com) अथवा मोबाइल नंबर (7045377303) के लिए सुरक्षित है।',
  };
}

/**
 * Checks if the stored admin session is valid and privileged.
 */
export function isCurrentlyAdminAuthenticated(): boolean {
  try {
    const isLogged = localStorage.getItem('vsm_admin_logged_in') === 'true';
    const user = localStorage.getItem('vsm_admin_user') || '';
    if (!isLogged || !user) return false;
    return checkAdminPrivilege(user).isAuthorized;
  } catch {
    return false;
  }
}

/**
 * Persists authenticated admin session.
 */
export function saveAdminSession(identifier: string): void {
  try {
    const privilege = checkAdminPrivilege(identifier);
    if (privilege.isAuthorized) {
      localStorage.setItem('vsm_admin_logged_in', 'true');
      localStorage.setItem('vsm_admin_user', privilege.cleanIdentifier);
      localStorage.setItem('vsm_admin_role', 'super_admin');
    }
  } catch (e) {
    console.warn('Failed to save admin session:', e);
  }
}

/**
 * Clears admin session upon logout.
 */
export function clearAdminSession(): void {
  try {
    localStorage.removeItem('vsm_admin_logged_in');
    localStorage.removeItem('vsm_admin_user');
    localStorage.removeItem('vsm_admin_role');
  } catch (e) {
    console.warn('Failed to clear admin session:', e);
  }
}
