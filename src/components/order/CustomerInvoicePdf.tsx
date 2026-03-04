import React from 'react';
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';
import { registerBanglaFont } from '@/lib/registerFonts';

registerBanglaFont();

const styles = StyleSheet.create({
    page: {
        fontFamily: 'NotoSansBengali',
        fontSize: 10,
        padding: 40,
        color: '#000000',
    },
    // Header
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    logoBlock: {},
    logo: {
        width: 110,
        objectFit: 'contain',
    },
    storeInfo: {
        marginTop: 5,
    },
    storeText: {
        fontSize: 9,
        color: '#3c3c3c',
        marginBottom: 2,
    },
    titleBlock: {
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    orderNumber: {
        fontSize: 10,
        color: '#646464',
        marginTop: 4,
    },
    orderDate: {
        fontSize: 10,
        color: '#646464',
        marginTop: 2,
    },
    orderStatus: {
        fontSize: 10,
        fontWeight: 'bold',
        marginTop: 4,
    },
    divider: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#c8c8c8',
        marginVertical: 10,
    },
    // Bill To / Ship To
    twoColRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    leftCol: {
        width: '48%',
    },
    rightCol: {
        width: '48%',
    },
    sectionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 10,
        color: '#3c3c3c',
        marginBottom: 2,
    },
    // Table
    table: {
        marginTop: 5,
        borderWidth: 0.5,
        borderColor: '#dcdcdc',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderBottomWidth: 0.5,
        borderBottomColor: '#dcdcdc',
        alignItems: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#dcdcdc',
        alignItems: 'center',
    },
    colDesc: {
        width: '45%',
        paddingHorizontal: 4,
        paddingVertical: 5,
        borderRightWidth: 0.5,
        borderRightColor: '#dcdcdc',
    },
    colQty: {
        width: '12%',
        paddingHorizontal: 4,
        textAlign: 'center',
        paddingVertical: 5,
        borderRightWidth: 0.5,
        borderRightColor: '#dcdcdc',
    },
    colPrice: {
        width: '20%',
        paddingHorizontal: 4,
        textAlign: 'right',
        paddingVertical: 5,
        borderRightWidth: 0.5,
        borderRightColor: '#dcdcdc',
    },
    colTotal: {
        width: '23%',
        paddingHorizontal: 4,
        textAlign: 'right',
        paddingVertical: 5,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 10,
    },
    cellText: {
        fontSize: 10,
    },
    variantText: {
        fontSize: 8,
        color: '#666666',
        marginTop: 2,
    },
    // Summary
    summaryBlock: {
        marginTop: 8,
        alignItems: 'flex-end',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 3,
        width: 220,
    },
    summaryLabel: {
        width: 130,
        textAlign: 'right',
        paddingRight: 8,
        fontSize: 10,
    },
    summaryValue: {
        width: 90,
        textAlign: 'right',
        fontSize: 10,
    },
    totalDivider: {
        borderTopWidth: 0.5,
        borderTopColor: '#000',
        marginTop: 3,
        paddingTop: 5,
    },
    totalLabel: {
        width: 130,
        textAlign: 'right',
        paddingRight: 8,
        fontSize: 12,
        fontWeight: 'bold',
    },
    totalValue: {
        width: 90,
        textAlign: 'right',
        fontSize: 12,
        fontWeight: 'bold',
    },
    discountText: {
        color: '#dc2626',
    },
    dueText: {
        fontWeight: 'bold',
        color: '#dc2626',
    },
});

function formatCurrency(amount: number): string {
    return `BDT ${parseFloat(String(amount || 0)).toFixed(2)}`;
}

function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
}

interface CustomerInvoicePdfProps {
    order: any;
    storeData: any;
}

const CustomerInvoicePdf: React.FC<CustomerInvoicePdfProps> = ({
    order,
    storeData,
}) => {
    const shipping = order.shippingAddress || {};
    const customerName = `${shipping.firstName} ${shipping.lastName}`;

    const billingLines = [
        customerName,
        shipping.phone,
        shipping.email,
    ].filter(Boolean);

    const shippingLines = [
        customerName,
        shipping.address1,
        shipping.address2,
        `Phone: ${shipping.phone}`,
    ].filter((line) => line && line.trim());

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header: Logo+Store left, Invoice right */}
                <View style={styles.headerRow}>
                    <View style={styles.logoBlock}>
                        <Image style={styles.logo} src="/logo.png" />
                        <View style={styles.storeInfo}>
                            <Text style={styles.storeText}>
                                {storeData?.address ||
                                    '123 Business Street, Dhaka, Bangladesh'}
                            </Text>
                            <Text style={styles.storeText}>
                                Email: {storeData?.email || 'info@zbazar.com'}
                            </Text>
                            <Text style={styles.storeText}>
                                Phone: {storeData?.phone || '+880 1234-567890'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.titleBlock}>
                        <Text style={styles.title}>INVOICE</Text>
                        <Text style={styles.orderNumber}>#{order.orderNumber}</Text>
                        <Text style={styles.orderDate}>
                            Date: {formatDate(order.createdAt)}
                        </Text>
                        <Text style={styles.orderStatus}>
                            {order.status?.toUpperCase() || 'PENDING'}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Bill To / Ship To */}
                <View style={styles.twoColRow}>
                    <View style={styles.leftCol}>
                        <Text style={styles.sectionTitle}>Bill To:</Text>
                        {billingLines.map((line, i) => (
                            <Text style={styles.infoText} key={i}>
                                {line}
                            </Text>
                        ))}
                    </View>
                    <View style={styles.rightCol}>
                        <Text style={styles.sectionTitle}>Ship To:</Text>
                        {shippingLines.map((line, i) => (
                            <Text style={styles.infoText} key={i}>
                                {line}
                            </Text>
                        ))}
                    </View>
                </View>

                {/* Items Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.headerText, styles.colDesc]}>
                            Item Description
                        </Text>
                        <Text style={[styles.headerText, styles.colQty]}>Qty</Text>
                        <Text style={[styles.headerText, styles.colPrice]}>
                            Unit Price
                        </Text>
                        <Text style={[styles.headerText, styles.colTotal]}>
                            Total
                        </Text>
                    </View>

                    {order.items?.map((item: any, index: number) => {
                        const options: string[] = [];
                        if (item.size) options.push(item.size);
                        if (item.color) options.push(item.color);
                        const variantInfo =
                            options.length > 0 ? options.join(' / ') : '';

                        return (
                            <View style={styles.tableRow} key={index}>
                                <View style={styles.colDesc}>
                                    <Text style={styles.cellText}>
                                        {item.product?.title || 'Product'}
                                    </Text>
                                    {variantInfo && (
                                        <Text style={styles.variantText}>
                                            {variantInfo}
                                        </Text>
                                    )}
                                </View>
                                <Text style={[styles.cellText, styles.colQty]}>
                                    {item.quantity}
                                </Text>
                                <Text style={[styles.cellText, styles.colPrice]}>
                                    {formatCurrency(item.price)}
                                </Text>
                                <Text style={[styles.cellText, styles.colTotal]}>
                                    {formatCurrency(item.price * item.quantity)}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Totals */}
                <View style={styles.summaryBlock}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal:</Text>
                        <Text style={styles.summaryValue}>
                            {formatCurrency(order.subtotal)}
                        </Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Shipping:</Text>
                        <Text style={styles.summaryValue}>
                            {order.shipping === 0
                                ? 'Free'
                                : formatCurrency(order.shipping)}
                        </Text>
                    </View>

                    {order.discount > 0 && (
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, styles.discountText]}>
                                Discount:
                            </Text>
                            <Text style={[styles.summaryValue, styles.discountText]}>
                                -{formatCurrency(order.discount)}
                            </Text>
                        </View>
                    )}

                    <View
                        style={[styles.summaryRow, styles.totalDivider]}
                    >
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalValue}>
                            {formatCurrency(order.total)}
                        </Text>
                    </View>

                    <View style={[styles.summaryRow, { marginTop: 4 }]}>
                        <Text style={styles.summaryLabel}>Paid Amount:</Text>
                        <Text style={styles.summaryValue}>
                            {formatCurrency(order.paidAmount || 0)}
                        </Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={[styles.summaryLabel, styles.dueText]}>
                            Due Amount:
                        </Text>
                        <Text style={[styles.summaryValue, styles.dueText]}>
                            {formatCurrency(order.dueAmount || 0)}
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default CustomerInvoicePdf;
