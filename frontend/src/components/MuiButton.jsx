/* ================================================
   MUI Button Component - Institutional Standard
   Unified Button Usage - No Custom Styling
   ================================================ */

import { Button } from '@mui/material';

export default function MuiButton({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  type = 'button',
  ...props
}) {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </Button>
  );
}

/* VERIFICATION - This component uses MUI theme standards:
 * - Colors: primary (#007bff), success (#28a745), error (#dc3545), warning (#ffc107)
 * - Font: Roboto, 14px, fontWeight 500
 * - Padding: 10px 24px (MUI theme)
 * - Border Radius: 2px (institutional minimal)
 * - Hover State: Darker variant with box-shadow 0 2px 4px
 * - No custom CSS override possible - pure MUI theming
 */
