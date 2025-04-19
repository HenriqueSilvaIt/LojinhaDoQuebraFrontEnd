import moment from "moment";
import './style.css';
import { OrderDTO } from "../../models/order";



export function handlePrint(order: OrderDTO, paymentMethod: string) {




    if (!order || !order.items) {
        console.error("Dados do pedido incompletos para impressão.");
        return;
    }


    let textoRecibo = "";

    // Cabeçalho
    textoRecibo += "Lojinha Do Quebra\n";
    textoRecibo += moment(order.moment).format("DD/MM/YYYY HH:mm") + "\n";
    textoRecibo += "Cupom Eletrônico\n";
    textoRecibo += `Número do Pedido: ${order.id}\n`;
    textoRecibo += "------------------------------\n";
    textoRecibo += "Produto     Qtd       Subtotal\n";
    textoRecibo += "------------------------------\n";

    // Itens
    order.items.forEach(item => {
        const nomeProduto = item.name.padEnd(18, ' ');
        const quantidade = String(item.quantity).padStart(3, ' ');
     //   const valorUnitario = `R$ ${item.price.toFixed(2)}`.padStart(8, ' ');
        const subtotal = `R$ ${item.subTotal?.toFixed(2)}`.padStart(14, ' ');
        textoRecibo += `${nomeProduto}${quantidade} ${valorUnitario} ${subtotal}\n`;
    });
    textoRecibo += "------------------------------\n";
    textoRecibo += `Total: R$ ${order.total?.toFixed(2)}\n`;

        textoRecibo += `Forma de Pagamento: ${paymentMethod}\n`;

    textoRecibo += "------------------------------\n";
    textoRecibo += "Obrigado pela sua compra!\n";
    ttextoRecibo += "------------------------------\n\n\n\n\n";


    // Cria um elemento <pre> temporário
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(`<pre style="white-space: pre-wrap;">${textoRecibo}</pre>`);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        // Não é necessário recarregar a página aqui, a janela de impressão se fecha sozinha
    } else {
        console.error("Não foi possível abrir a janela de impressão.");
    }
}
