import jsPDF from "jspdf";
import "jspdf-autotable";

export default class PDFMaker {
  private static formatDate(date) {
    const dt = new Date(date);

    return `${dt.getUTCHours().toString().padStart(2, '0')}:${dt.getUTCMinutes().toString().padStart(2, '0')} ${dt.getUTCDate().toString().padStart(2, '0')}-${(dt.getUTCMonth() + 1).toString().padStart(2, '0')}-${dt.getUTCFullYear()}`;
  }

  static generatePDF(order) {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Stella Clothes", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Av. Brasília, 1400-038 Lisboa", 105, 30, { align: "center" });
    doc.text("987 654 321", 105, 35, { align: "center" });

    doc.text("Nome Cliente: " + order.firstName + " " + order.lastName, 10, 50);
    doc.text("Recibo #" + order._id, 10, 60);
    doc.text("Data Encomenda: " + this.formatDate(order.createdAt), 10, 70);

    const formatOrderDataForTable = (orderData): (string | number)[][] => {
      return orderData.map(product => [
        product.name,
        product.quantity.toString(),
        `${product.priceAtTime} €`,
        `${product.priceAtTime * product.quantity} €`
      ]);
    };

    (doc as any).autoTable({
      startY: 80,
      head: [['Descrição Artigo', 'Quantidade', 'Preço/Unidade', 'Total']],
      body: formatOrderDataForTable(order.orderData),
      foot: [
        [{ content: 'Total', colSpan: 3, styles: { halign: 'right' } }, `${order.total} €`]
      ]
    });

    doc.text("Obrigado pelo teu pedido na Stella Clothes", 105, (doc as any).autoTable.previous.finalY + 20, { align: "center" });
    doc.text("Com os nossos melhores cumprimentos", 105, (doc as any).autoTable.previous.finalY + 30, { align: "center" });
    doc.text("Stella Clothes", 105, (doc as any).autoTable.previous.finalY + 35, { align: "center" });

    // doc.save(`Recibo_${ order._id }.pdf`);

    return doc.output('blob');
  }
}
