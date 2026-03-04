declare global {
  interface Window {
    dataLayer: any[];
  }
}

export const pushToDataLayer = (event: string, ecommerceData?: any) => {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];

  window.dataLayer.push({
    event,
    ecommerce: ecommerceData,
  });
};