/**
 * Centralized Icon Configuration
 * Using Lucide React for consistent, modern, minimalistic icons
 */

import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  DollarSign,
  Receipt,
  CreditCard,
  Settings as SettingsIcon,
  Wrench,
  LogOut,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Menu,
  X,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  Bell,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Home,
  Key,
  Briefcase,
  UserPlus,
  UserMinus,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  MoreHorizontal,
  Save,
  Copy,
  Share2,
  Printer,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Activity,
  Zap,
  Shield,
  Lock,
  Unlock,
  Star,
  Heart,
  Bookmark,
  Tag,
  Folder,
  File,
  Image,
  Paperclip,
  Link,
  ExternalLink,
  Minimize2,
  Maximize2,
  Grid,
  List,
  Columns,
  Send,
  CheckCircle,
  Hash,
  User,
} from 'lucide-react';

// Icon size presets
export const ICON_SIZES = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

// Navigation Icons
export const NavIcons = {
  Dashboard: LayoutDashboard,
  Properties: Building2,
  Tenants: Users,
  Users: Users,
  Leases: FileText,
  Income: DollarSign,
  Expenses: Receipt,
  Cards: CreditCard,
  Wrench: Wrench,
  Mail: Mail,
  BarChart: BarChart3,
  Settings: SettingsIcon,
  Logout: LogOut,
};

// Action Icons
export const ActionIcons = {
  Add: Plus,
  Edit: Edit,
  Delete: Trash2,
  View: Eye,
  Hide: EyeOff,
  Save: Save,
  Copy: Copy,
  Share: Share2,
  Print: Printer,
  Download: Download,
  Upload: Upload,
  Refresh: RefreshCw,
  Search: Search,
  Filter: Filter,
};

// UI Icons
export const UIIcons = {
  ChevronRight: ChevronRight,
  ChevronLeft: ChevronLeft,
  ChevronUp: ChevronUp,
  ChevronDown: ChevronDown,
  Menu: Menu,
  Close: X,
  X: X,
  Check: Check,
  CheckCircle: CheckCircle,
  MoreVertical: MoreVertical,
  MoreHorizontal: MoreHorizontal,
  Minimize: Minimize2,
  Maximize: Maximize2,
  Grid: Grid,
  List: List,
  Columns: Columns,
  HelpCircle: HelpCircle,
  Plus: Plus,
  Filter: Filter,
  Download: Download,
  Upload: Upload,
  Send: Send,
  Calendar: Calendar,
  MapPin: MapPin,
  Home: Home,
  User: User,
  Hash: Hash,
  DollarSign: DollarSign,
  FileText: FileText,
  Shield: Shield,
  TrendingUp: TrendingUp,
  TrendingDown: TrendingDown,
  CreditCard: CreditCard,
  BarChart3: BarChart3,
  ArrowUp: ArrowUp,
  ArrowDown: ArrowDown,
  AlertCircle: AlertCircle,
  Wrench: Wrench,
  Mail: Mail,
  Users: Users,
  Paperclip: Paperclip,
  Search: Search,
};

// Status Icons
export const StatusIcons = {
  Success: Check,
  Error: AlertCircle,
  Warning: AlertCircle,
  Info: Info,
  Help: HelpCircle,
};

// Communication Icons
export const CommIcons = {
  Notification: Bell,
  Email: Mail,
  Phone: Phone,
  Location: MapPin,
};

// Data Icons
export const DataIcons = {
  TrendUp: TrendingUp,
  TrendDown: TrendingDown,
  PieChart: PieChart,
  BarChart: BarChart3,
  Activity: Activity,
};

// Property/Business Icons
export const BusinessIcons = {
  Property: Building2,
  Home: Home,
  Key: Key,
  Briefcase: Briefcase,
  Calendar: Calendar,
  Clock: Clock,
};

// User Icons
export const UserIcons = {
  User: Users,
  UserAdd: UserPlus,
  UserRemove: UserMinus,
};

// Security Icons
export const SecurityIcons = {
  Shield: Shield,
  Lock: Lock,
  Unlock: Unlock,
  Zap: Zap,
};

// File Icons
export const FileIcons = {
  Folder: Folder,
  File: File,
  Image: Image,
  Attachment: Paperclip,
  Link: Link,
  ExternalLink: ExternalLink,
};

// Misc Icons
export const MiscIcons = {
  Star: Star,
  Heart: Heart,
  Bookmark: Bookmark,
  Tag: Tag,
  Arrow: {
    Right: ArrowRight,
    Left: ArrowLeft,
    Up: ArrowUp,
    Down: ArrowDown,
  },
};

// Helper function to render icons with consistent sizing
export const renderIcon = (IconComponent, size = 'md', className = '', style = {}) => {
  const iconSize = ICON_SIZES[size] || ICON_SIZES.md;
  return <IconComponent size={iconSize} className={className} style={style} />;
};

// Export all icons for direct import
export {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  DollarSign,
  Receipt,
  CreditCard,
  SettingsIcon,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  Bell,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Home,
  Key,
  Briefcase,
  UserPlus,
  UserMinus,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  MoreHorizontal,
  Save,
  Copy,
  Share2,
  Printer,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Activity,
  Zap,
  Shield,
  Lock,
  Unlock,
  Star,
  Heart,
  Bookmark,
  Tag,
  Folder,
  File,
  Image,
  Paperclip,
  Link,
  ExternalLink,
  Minimize2,
  Maximize2,
  Grid,
  List,
  Columns,
};
