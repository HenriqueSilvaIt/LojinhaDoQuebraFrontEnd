import { useEffect, useState } from "react";
import * as mercadoPagoService from '../../services/mercado-pago';
import axios from "axios";
import ButtonSecondy from "../ButtonSecondy";
import * as cartService from '../../services/cart-services'
import { OrderDTO } from "../../models/order";
import './style.css';

export default function Payment() {


    const [showPaymentStatus, setShowPaymentStatus] = useState(false); // Novo estado
    const [instalmmentValue, setInstamentValue] = useState<any>();
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle'); // Estado do pagamento
    const [paymentIntentId, setPaymentIntentId] = useState('');
      const [dialogInfoData, setDialogInfoData] = useState<{
            visable: boolean;
            message: string;
        }>({
            visable: false,
            message: 'Sucesso'
        });
    

        const [cart] = useState<OrderDTO>(cartService.getCart());
        
    useEffect(() => {
        if (paymentIntentId) {
            const interval = setInterval(() => {
                mercadoPagoService.obterStatusIntencaoPagamento(paymentIntentId).then(response => {
                    setPaymentStatus(response.data.state);
                });
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [paymentIntentId]);



    function formatTotalValue(totalValue: number): number {
        const valueInCents = totalValue * 100;
        const roundedValue = Math.round(valueInCents);
        return Math.abs(roundedValue);
    }
    const handlePagamento = () => {
        if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
            if (typeof cart.total !== 'number' || isNaN(cart.total)) {
                console.error('Valor total do carrinho inválido:', cart.total);
                return;
            }
            const name = cart.items.map(x => x.name).join(', ');
            const formattedTotalValue = formatTotalValue(Number(cart.total));
            setPaymentStatus('pending');
            setShowPaymentStatus(true);
            mercadoPagoService.criarIntencaoPagamento({
                amount: formattedTotalValue,
                description: name,
                payment: {
                    type: paymentMethod,
                    ...(paymentMethod === 'credit_card' && { installments: instalmmentValue, installments_cost: "seller" }),
                },
                additional_info: {
                    external_reference: "12321hadas-12321jasd-12321jasda-123j213asd",
                    print_on_terminal: true
                }
            }).then(response => {
                setPaymentIntentId(response.data.Id);
                setDialogInfoData({ ...dialogInfoData, visable: true });
                // Adicionando um atraso de 15 segundos antes de iniciar as verificações de status
                setTimeout(() => {
                    const interval = setInterval(() => {
                        mercadoPagoService.obterStatusIntencaoPagamento(response.data.Id).then(statusResponse => {
                            if (statusResponse.data.state === 'FINISHED') {
                                setPaymentStatus('success');
                                clearInterval(interval);
                            } else if (statusResponse.data.state === 'CANCELED' || statusResponse.data.state === 'ERROR') {
                                setPaymentStatus('error');
                                clearInterval(interval);
                            }
                        });
                    }, 5000);
                    // Limpeza do intervalo ao desmontar o componente
                    return () => clearInterval(interval);
                }, 15000); // 15000 milissegundos = 15 segundos
            }).catch(error => {
                console.error("Erro ao criar intenção de pagamento:", error);
                setPaymentStatus('error');
            });
        } else if (paymentMethod === 'Dinheiro' || paymentMethod === 'Pix') {
            console.log('Pagamento com', paymentMethod, '. Intenção de pagamento não enviada.');
        } else if (paymentMethod) {
            console.error('Selecione uma forma de pagamento.');
        }
    };

    function handlePaymentMethod(event: any) {
        setPaymentMethod(event.target.value);
    }

    function handleInstalment(event: any) {

        setInstamentValue(parseInt(event.target.value, 10));
    }

    const handleDialogPayment = (confirm: boolean) => {
        setDialogInfoData({ ...dialogInfoData, visable: false });
        console.log(confirm);
    };



    function PaymentStatus({ paymentIntentId }: { paymentIntentId: string }) {
        const [paymentStatus, setPaymentStatus] = useState<any>(null);
        const [error, setError] = useState<string | null>(null);

        useEffect(() => {
            if (paymentIntentId) {
                axios.get(`http://localhost:8091/mercado-pago-payment-status/${paymentIntentId}`)
                    .then(response => {
                        setPaymentStatus(response.data);
                    })
                    .catch(error => {
                        console.error('Erro ao obter status do pagamento:', error);
                        setError('Erro ao obter status do pagamento.');
                    });
            }
        }, [paymentIntentId]);

        if (error) {
            return <p>{error}</p>;
        }

        if (!paymentStatus) {
            return <p>Carregando status do pagamento...</p>;
        }

        const status = paymentStatus.state;
        let statusMessage = '';
        let statusColor = 'black';

        switch (status) {
            case 'FINISHED':
                statusMessage = 'Pagamento realizado com sucesso!';
                statusColor = 'green';
                break;
            case 'CONFIRMATION_REQUIRED':
                statusMessage = 'Confirmação necessária no dispositivo.';
                statusColor = 'orange';
                break;
            case 'CANCELED':
                statusMessage = 'Pagamento cancelado.';
                statusColor = 'red';
                break;
            case 'ERROR':
                statusMessage = 'Erro na transação.';
                statusColor = 'red';
                break;
            case 'ABANDONED':
                statusMessage = 'Pagamento abandonado.';
                statusColor = 'gray';
                break;
            case 'OPEN':
                statusMessage = 'Intenção de pagamento aberta.';
                break;
            case 'ON_TERMINAL':
                statusMessage = 'Aguardando interação no terminal.';
                break;
            case 'PROCESSING':
                statusMessage = 'Processando pagamento.';
                break;
            case 'PROCESSED':
                statusMessage = 'Pagamento processado.';
                break;
            default:
                statusMessage = 'Status do pagamento desconhecido.';
                break;
        }

        return (
            <div>
                <h2>Status do Pagamento</h2>
                <p style={{ color: statusColor }}>{statusMessage}</p>
                <pre>{JSON.stringify(paymentStatus, null, 2)}</pre>
            </div>
        );
    }


    return (

        <div className="dsc-payment-form">
            <h3>Forma da pagamento</h3>
            <div>
                <select className="dsc-btn dsc-btn-primary dsc-payment-method" onChange={handlePaymentMethod}>
                    <option value="">Selecione a forma de pagamento</option>
                    <option value="debit_card">Cartão de débito</option>
                    <option value="credit_card">Cartão de crédito</option>
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="pi">Pix</option>

                </select>
            </div>
            {paymentMethod === "credit_card" ?
                <div className="dsc-installments">
                    <p>Nº de Parcelas: </p>
                    <select className="dsc-btn dsc-btn-primary dsc-installments " onChange={handleInstalment}>
                        <option value="1">1x</option>
                        <option value="2">2x</option>
                        <option value="3">3x</option>
                        <option value="4">4x</option>
                        <option value="5">5x</option>
                        <option value="6">6x</option>
                        <option value="7">7x</option>
                        <option value="8">8x</option>
                        <option value="9">9x</option>
                        <option value="10">10x</option>
                        <option value="11">11x</option>
                        <option value="12">12x</option>
                    </select>
                </div> : ""

            }
            <button className="dsc-btn dsc-btn-blue" onClick={handlePagamento}>Pagar</button>
            {paymentIntentId && paymentStatus && <p>Status do pagamento: {paymentStatus}</p>}

        </div>
        


    );

    { paymentIntentId && showPaymentStatus && <PaymentStatus paymentIntentId={paymentIntentId} /> }

    {dialogInfoData.visable && (
        <div className="dsc-dialog-background">
            <div className="dsc-dialog-box">

                {paymentStatus === 'pending' && <p>Aguardando pagamento...</p>}
                {paymentStatus === 'success' && <p>Pagamento realizado com sucesso!</p>}
                {paymentStatus === 'error' && <p>Erro no pagamento.</p>}
                <div className="dsc-dialog-btn-container">
                    <div onClick={() => handleDialogPayment(false)}>
                        <ButtonSecondy text="Fechar" />
                    </div>
                </div>
            </div>
        </div>
    )}

  
}
