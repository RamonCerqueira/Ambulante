// components/mapIcons.ts
import L from 'leaflet';

export const userIcon = L.icon({
  iconUrl:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxMiIgZmlsbD0iIzAwNEU4OSIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjgiIGZpbGw9IiNmZmYiLz48L3N2Zz4=',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export const vendorIcon = L.icon({
  iconUrl:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cGF0aCBkPSJNMjAgMEM5IDAgMCA5IDAgMjBjMCAyMCAyMCAyMCAyMCAyMHMyMCAwIDIwLTIwYzAtMTEtOSAyMC0yMCAyMHoiIGZpbGw9IiNGRjZCMzUiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjE1IiByPSI2IiBmaWxsPSIjZmZmIi8+PC9zdmc+',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export const selectedVendorIcon = L.icon({
  iconUrl:
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4Ij48cGF0aCBkPSJNMjQgMEMxMS41IDAgMCAxMS41IDAgMjRjMCAxMyAxMyAyNCAyNCAyNHMyNC0xMSAyNC0yNEM0OCAxMS41IDM2LjUgMCAyNCAweiIgZmlsbD0iI0ZGNkIzNSIvPjxjaXJjbGUgY3g9IjI0IiBjeT0iMTciIHI9IjciIGZpbGw9IiNmZmYiLz48L3N2Zz4=',
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48],
});
