// Every color the app uses, one set per theme.
//
// darkTheme  = the colors the app uses today (taken from the hardcoded values in the components).
// lightTheme = a matching light palette. It is typed as `typeof darkTheme`, so TypeScript
//              will error if the two themes ever have different keys.
//
// Keys are named by ROLE (what the color is for), not by the color itself, so the same key
// works in both themes. Colors with 8 digits (e.g. '#ffffff14') are semi-transparent.

const darkTheme = {
  // ---------------------------------------------------------------------
  // Page and surfaces
  // ---------------------------------------------------------------------
  backgroundColor: '#1d1d1d', // the page behind everything
  surfaceColor: '#242424', // cards, tables, table rows
  surfaceHoverColor: '#2a2a2a', // table row on hover / when expanded
  surfaceExpandedColor: '#1f1f1f', // the area that drops down under an expanded row
  panelBackgroundColor: '#212121', // accordions and the stock history panel
  headerBackgroundColor: '#242424', // top bar
  sidebarBackgroundColor: '#262626', // left side menu and the cart bar
  menuBackgroundColor: '#1f1f1f', // pop-up menus (account menu, kebab menu)
  modalBackground:
    'linear-gradient(135deg, #1e1e1e 0%, #303030 100%)', // modal panel (a gradient, use as `background`)
  modalBackdropColor: '#1e1e1edc', // dimmed area behind a modal
  loginBackground: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', // login page
  loginCardBackground: 'linear-gradient(135deg, #2a2a2a 0%, #3a3a3a 100%)', // login box

  // ---------------------------------------------------------------------
  // Borders
  // ---------------------------------------------------------------------
  borderColor: '#333333', // card and table borders, header dividers
  borderSubtleColor: '#2e2e2e', // dividers between rows
  borderStrongColor: '#4a4a4a', // modal footer, lists, image borders
  panelBorderColor: '#cccccc', // accordion and stock history outline
  sidebarBorderColor: '#ffffff14', // edge of the side menu and cart bar
  menuBorderColor: '#403f3f', // pop-up menu outline

  // ---------------------------------------------------------------------
  // Text
  // ---------------------------------------------------------------------
  textPrimaryColor: '#ffffff', // main text and headings
  textSecondaryColor: '#cfcfcf', // values, secondary text
  textMutedColor: '#a7a7a7', // descriptions, dates, loading / empty messages
  textFaintColor: '#8a8a8a', // small uppercase labels and table headers
  sidebarTextColor: '#9a9a9a', // side menu links and icons (not selected)
  sidebarTextActiveColor: '#ffffff', // side menu link that is selected / hovered
  linkHoverColor: '#4e0909', // Back / Edit / Cancel buttons on hover

  // ---------------------------------------------------------------------
  // Hover and selected highlights (translucent so they work on any surface)
  // ---------------------------------------------------------------------
  hoverOverlayColor: '#ffffff14', // list rows and menu items on hover
  activeOverlayColor: '#ffffff1a', // selected side menu link, count badges, toggles

  // ---------------------------------------------------------------------
  // Brand accent and buttons
  // ---------------------------------------------------------------------
  accentColor: '#580909', // active-link bar, underlines, focus ring
  buttonBackgroundColor: '#3a0e03',
  buttonHoverBackgroundColor: '#4e0909',
  buttonTextColor: '#ffffff',
  buttonBorderColor: '#a3a3a3',
  successButtonBackgroundColor: '#103a22', // "+ Add" stock button
  successButtonHoverBackgroundColor: '#16502f',

  // ---------------------------------------------------------------------
  // Form inputs
  // ---------------------------------------------------------------------
  inputBackgroundColor: '#ebebeb', // form fields (FormInputs, searchable select)
  inputTextColor: '#1a1a1a',
  inputBorderColor: '#a3a3a3',
  inputErrorBorderColor: '#4f0000',
  compactInputBackgroundColor: '#161616', // small inputs: search box, stock amount, filters
  compactInputTextColor: '#ffffff',
  compactInputBorderColor: '#a3a3a3',
  filterBarBackgroundColor: '#181818', // strip behind the table filters
  dropZoneBackgroundColor: '#2d2d2d', // file drop area
  dropZoneActiveBackgroundColor: '#3a3a3a', // while dragging, and file rows in the list
  dropZoneBorderColor: '#555555',
  dropZoneActiveBorderColor: '#888888',

  // ---------------------------------------------------------------------
  // Status colors
  // ---------------------------------------------------------------------
  errorTextColor: '#ff6b6b',
  successTextColor: '#5fd38d', // stock added / positive change
  warningTextColor: '#e0b04a', // "below minimum stock" notice
  warningIconColor: '#ff7221', // low stock icon in the parts table
  toastSuccessBackgroundColor: '#377553',
  toastErrorBackgroundColor: '#755147',

  // ---------------------------------------------------------------------
  // Account chip in the header
  // ---------------------------------------------------------------------
  accountChipBackgroundColor: '#292929e5',
  accountChipHoverBackgroundColor: '#141414e5',
  avatarBackgroundColor: '#458fff',

  // ---------------------------------------------------------------------
  // Misc
  // ---------------------------------------------------------------------
  shadowColor: '#00000066', // drop shadows on the side menu and cart bar
  spinnerTrackColor: '#3a3a3a', // loading spinner ring
  spinnerHeadColor: '#cfcfcf', // the moving part of the spinner
};

const lightTheme: typeof darkTheme = {
  // Page and surfaces
  backgroundColor: '#f4f4f5',
  surfaceColor: '#ffffff',
  surfaceHoverColor: '#f4f4f5',
  surfaceExpandedColor: '#fafafa',
  panelBackgroundColor: '#ffffff',
  headerBackgroundColor: '#ffffff',
  sidebarBackgroundColor: '#ffffff',
  menuBackgroundColor: '#ffffff',
  modalBackground: 'linear-gradient(135deg, #ffffff 0%, #f4f4f5 100%)',
  modalBackdropColor: '#18181b66',
  loginBackground: 'linear-gradient(135deg, #e4e4e7 0%, #f4f4f5 100%)',
  loginCardBackground: 'linear-gradient(135deg, #ffffff 0%, #f4f4f5 100%)',

  // Borders
  borderColor: '#e4e4e7',
  borderSubtleColor: '#ececef',
  borderStrongColor: '#d4d4d8',
  panelBorderColor: '#d4d4d8',
  sidebarBorderColor: '#e4e4e7',
  menuBorderColor: '#d4d4d8',

  // Text
  textPrimaryColor: '#18181b',
  textSecondaryColor: '#3f3f46',
  textMutedColor: '#52525b',
  textFaintColor: '#71717a',
  sidebarTextColor: '#71717a',
  sidebarTextActiveColor: '#18181b',
  linkHoverColor: '#580909',

  // Hover and selected highlights
  hoverOverlayColor: '#0000000d',
  activeOverlayColor: '#00000014',

  // Brand accent and buttons
  accentColor: '#580909',
  buttonBackgroundColor: '#3a0e03',
  buttonHoverBackgroundColor: '#4e0909',
  buttonTextColor: '#ffffff',
  buttonBorderColor: '#3a0e03',
  successButtonBackgroundColor: '#103a22',
  successButtonHoverBackgroundColor: '#16502f',

  // Form inputs
  inputBackgroundColor: '#ffffff',
  inputTextColor: '#18181b',
  inputBorderColor: '#a1a1aa',
  inputErrorBorderColor: '#b91c1c',
  compactInputBackgroundColor: '#ffffff',
  compactInputTextColor: '#18181b',
  compactInputBorderColor: '#a1a1aa',
  filterBarBackgroundColor: '#ececef',
  dropZoneBackgroundColor: '#fafafa',
  dropZoneActiveBackgroundColor: '#f0f0f2',
  dropZoneBorderColor: '#a1a1aa',
  dropZoneActiveBorderColor: '#71717a',

  // Status colors
  errorTextColor: '#c62828',
  successTextColor: '#2e7d32',
  warningTextColor: '#8a6100',
  warningIconColor: '#e65100',
  toastSuccessBackgroundColor: '#377553',
  toastErrorBackgroundColor: '#755147',

  // Account chip in the header
  accountChipBackgroundColor: '#f4f4f5',
  accountChipHoverBackgroundColor: '#e4e4e7',
  avatarBackgroundColor: '#458fff',

  // Misc
  shadowColor: '#00000026',
  spinnerTrackColor: '#e4e4e7',
  spinnerHeadColor: '#580909',
};

export const themeStyling = {
  lightTheme,
  darkTheme,
};

export type ThemeName = 'light' | 'dark';
export type ThemeColors = typeof darkTheme;
