/**
 * GA4 E-commerce event helpers (gtag)
 * https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtag
 *
 * All prices are in BDT (numeric, no formatting).
 * Events are pushed via window.gtag which GTM (GTM-NFTV34J4) already loads.
 */

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        gtag?: (...args: any[]) => void;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataLayer: any[];
    }
}

const CURRENCY = "BDT";

/** Push a gtag event — silently no-ops if gtag is not available. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pushEvent(eventName: string, params: Record<string, any>) {
    if (typeof window.gtag === "function") {
        window.gtag("event", eventName, params);
    } else if (Array.isArray(window.dataLayer)) {
        // GTM dataLayer fallback (gtag not yet hydrated)
        window.dataLayer.push({ event: eventName, ...params });
    }
}

// ---------------------------------------------------------------------------
// Item builder
// ---------------------------------------------------------------------------
function buildItem(
    product: {
        id?: string | number;
        name?: string;
        brand?: string;
        category?: string | { name?: string };
        price?: number;
        sku?: string;
    },
    quantity = 1,
    size?: string,
    color?: string
) {
    return {
        item_id: product.id?.toString() ?? product.sku ?? "",
        item_name: product.name ?? "",
        item_brand: product.brand ?? "",
        item_category:
            typeof product.category === "object"
                ? (product.category?.name ?? "")
                : (product.category ?? ""),
        price: product.price ?? 0,
        quantity,
        ...(size ? { item_variant: size } : {}),
        ...(color ? { item_color: color } : {}),
    };
}

// ---------------------------------------------------------------------------
// 1. view_item — fire when a product detail page loads
// ---------------------------------------------------------------------------
export function trackViewItem(product: Parameters<typeof buildItem>[0]) {
    pushEvent("view_item", {
        currency: CURRENCY,
        value: product.price ?? 0,
        items: [buildItem(product)],
    });
}

// ---------------------------------------------------------------------------
// 2. add_to_cart — fire when user clicks "Add to Cart" or "Buy Now"
// ---------------------------------------------------------------------------
export function trackAddToCart(
    product: Parameters<typeof buildItem>[0],
    quantity = 1,
    size?: string,
    color?: string
) {
    pushEvent("add_to_cart", {
        currency: CURRENCY,
        value: (product.price ?? 0) * quantity,
        items: [buildItem(product, quantity, size, color)],
    });
}

// ---------------------------------------------------------------------------
// 3. begin_checkout — fire once when checkout page mounts with items
// ---------------------------------------------------------------------------
export function trackBeginCheckout(
    items: Array<{
        product: Parameters<typeof buildItem>[0];
        quantity: number;
        size?: string;
        color?: string;
    }>,
    value: number
) {
    pushEvent("begin_checkout", {
        currency: CURRENCY,
        value,
        items: items.map((i) => buildItem(i.product, i.quantity, i.size, i.color)),
    });
}

// ---------------------------------------------------------------------------
// 4. purchase — fire when order is placed successfully
// ---------------------------------------------------------------------------
export function trackPurchase(
    order: {
        orderNumber?: string;
        id?: string | number;
        total?: number;
        shippingCharge?: number;
        tax?: number;
    },
    items: Array<{
        product: Parameters<typeof buildItem>[0];
        quantity: number;
        size?: string;
        color?: string;
    }>,
    grandTotal: number,
    shippingCost: number
) {
    pushEvent("purchase", {
        currency: CURRENCY,
        transaction_id: order.orderNumber ?? order.id?.toString() ?? "",
        value: grandTotal,
        shipping: shippingCost,
        tax: order.tax ?? 0,
        items: items.map((i) => buildItem(i.product, i.quantity, i.size, i.color)),
    });
}
