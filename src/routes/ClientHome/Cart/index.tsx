import './style.css';
import { useContext, useEffect, useRef, useState } from 'react';
import * as cartService from '../../../services/cart-services';
import * as orderService from '../../../services/order-service';
import { OrderDTO } from '../../../models/order';
import { Link, useNavigate } from 'react-router-dom';
import { ContextCartCount } from '../../../utils/context-cart';
import SerachBar from '../../../components/SearchBar';
import * as productService from '../../../services/product-services';
import { ProductDTO } from '../../../models/product';
import Clock from '../../../components/ClockOn/clock';
import * as mercadoPagoService from '../../../services/mercado-pago';
import ButtonSecondy from '../../../components/ButtonSecondy';

import axios from 'axios';

type QueryParams = {
    name: string;
}



export default function Cart() {

    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle'); // Estado do pagamento
    const [paymentIntentId, setPaymentIntentId] = useState('');


    const navigate = useNavigate();
    const [cart, setCart] = useState<OrderDTO>(cartService.getCart()); /* já estamos iniciando
    o use state pegando p rimeiro valor que está lá no localStorage */
    const [products, setProducts] = useState<ProductDTO>();
    const [valueToPay, setValueToPay] = useState<number>(cart.total);
    const inputRef = useRef<HTMLInputElement>(null); // Cria a referência
    const [pay, setPay] = useState<number>();
    const [showPaymentStatus, setShowPaymentStatus] = useState(false); // Novo estado

    const { setContextCartCount } = useContext(ContextCartCount);

    const [dialogInfoData, setDialogInfoData] = useState<{
        visable: boolean;
        message: string;
    }>({
        visable: false,
        message: 'Sucesso'
    });


    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus(); // Define o foco no input
        }
    }, []); // Executa apenas uma vez após a renderização inicial

    function handleClearClick() {
        cartService.clearCart(); /* aqui limpa no localstorage */
        updateCart();
        /* a variavel cart no use state vai pegar
            o resultado local storage e atualizar o no vizual, e a função que renderiza o carrinho lá em baixo 
            length === 0 vai atualziar também, porque vai ver que está zerado o carrinho  */
    }

    /* função para acrescentar novo produto no carrinho */
    function handleIncreaseItem(productId: number) {
        cartService.increaseItem(productId); // incrementa o item no local storage
        setCart(cartService.getCart());// atualizar no use state para atualizar no visual
    }

    /* função para remover novo produto no carrinho */
    function handleDecreaseItem(productId: number) {
        cartService.decreaseItem(productId); // incrementa o item no local storage
        updateCart();
        // atualizar no use state para atualizar no visual
    }

    function updateCart() {

        const newCart = cartService.getCart();
        setCart(newCart);
        setContextCartCount(newCart.items.length);
    }

    function handlePlaceOrderClick() {
        orderService.placeOrderRequest(cart)

            .then(response => {
                // Atualizar a quantidade dos produtos no backend
                const updatePromises = cart.items.map(item => {
                    return productService.findById(item.productId)
                        .then(productResponse => {
                            const product = productResponse.data;
                            if (product) {
                                const updatedProduct: ProductDTO = {
                                    ...product,
                                    quantity: product.quantity - item.quantity,
                                };
                                return productService.updateRequest(updatedProduct);
                            }
                            // Retorna uma Promise que resolve com null ou um valor padrão.
                            return Promise.resolve(null);
                        });
                });

                Promise.all(updatePromises)
                    .then(() => {
                        cartService.clearCart();
                        setContextCartCount(0);
                        navigate(`/confirmation/${response.data.id}`);
                    })
                    .catch(error => {
                        console.error("Erro ao atualizar a quantidade dos produtos:", error);
                        // Lidar com o erro, como exibir uma mensagem para o usuário
                    });
            });
    }



    const [queryParams, setQueryParams] = useState<QueryParams>();

    useEffect(() => {

        if (queryParams && queryParams.name) {

            productService.findByBarCode(queryParams.name)
                .then(response => {

                    const content: ProductDTO[] = response.data.content;

                    const barCode = content.filter(x => x.barCode === queryParams.name);


                    setProducts(barCode[0]);
                    console.log(barCode[0]);

                });
        }
    }, [queryParams]);

    /*Adicionei um segundo useEffect que observa a mudança de products. Quando products é definido,
     ele adiciona o produto ao carrinho e atualiza o carrinho. Depois, ele reseta products para undefined para que não seja adicionado novamente.*/
    useEffect(() => {
        if (products) {
            cartService.addProduct(products);

            updateCart();

            setProducts(undefined);
        }
    }, [products])


    function handleSearch(searchText: string) {
        setQueryParams({ name: searchText });
        updateCart();
    }

    function handleInputChange(event: any) {
        event.preventDefault();
        let value = event.target.value;

        // Remove todos os caracteres não numéricos e não ponto
        value = value.replace(/[^\d.]/g, '');

        // Garante que haja apenas um ponto decimal
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }

        // Formata para duas casas decimais
        if (parts.length === 2 && parts[1].length > 2) {
            value = parseFloat(value).toFixed(2);
        }
        setPay(value);

        if (pay != undefined) {
            const newValue = cart.total - pay;
            setValueToPay(Number(newValue));
        } else if (pay === undefined || null) {
            setValueToPay(0);
        }

    }

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
            const formattedTotalValue = formatTotalValue(Number(cart.total));
            setPaymentStatus('pending');
            setShowPaymentStatus(true);
            mercadoPagoService.criarIntencaoPagamento({
                amount: formattedTotalValue,
                description: products?.name,
                payment: {
                    type: paymentMethod,
                    ...(paymentMethod === 'credit_card' && { installments: 1, installments_cost: "seller" }),
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
                                cartService.clearCart();
                                setContextCartCount(0);
                                navigate(`/confirmation/${response.data.Id}`);
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


    return (/* quando abrimos chaves dentro do return é uma expressão do react */
        /* no primeiro elemento dentro da função map tem que colocar o key
        que ai pegamos o id do objeto porrque tem que ser um elemento único */
        <main className="dsc-container" >
            <SerachBar onSearch={handleSearch} inputRef={inputRef!} />
            <section id="cart-container-section" className="dsc-container">
                {
                    cart.items.length === 0
                        ? /* caso a quantidade de itens no carrinho foir 0 */
                        (
                            <div>
                                <h2 className="dsc-section-title dsc-mb20">Caixa livre</h2>

                                <Clock />

                            </div>


                        )
                        : (<div className="dsc-card dsc-mb20">

                            {cart.items.map(item => (

                                <div key={item.productId} className="dsc-cart-item-container dsc-line-bottom">
                                    <div className="dsc-cart-item-left">
                                        <img src={item.imgUrl} alt={item.name} />
                                        <div className="dsc-cart-item-description">
                                            <h3>{item.name}</h3>
                                            {item.quantity <= 4 ?
                                                <h4 className="dsc-form-error">{item.quantity}</h4>
                                                : ""}
                                            <div className="dsc-cart-item-quantity-container">
                                                <div onClick={() => handleDecreaseItem(item.productId)} className="dsc-cart-item-quantity-btn">-</div>
                                                <p>{item.quantity}</p>
                                                <div onClick={() => handleIncreaseItem(item.productId)} className="dsc-cart-item-quantity-btn">+</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="dsc-cart-item-right">R$ {(item.subTotal.toFixed(2))}</div>
                                </div>
                            ))
                            }
                            <div className="dsc-payment-container">
                                <div className="dsc-cart-total-container">

                                    <h4>Total da Compra:</h4>
                                    <div className="dsc-cart-totalvalue">
                                        <h3>R$ {cart.total.toFixed(2)}</h3>
                                    </div>

                                    <div className="dsc-pay">
                                        <h4>Valor Recebido:</h4>
                                        <input
                                            name="pag"
                                            value={pay}
                                            pattern="[0-9]+([\.,][0-9]+)?"
                                            step="0.01"
                                            type="float"
                                            onChange={handleInputChange}>

                                        </input>
                                    </div>
                                    <h4>Valor a pagar:</h4>


                                    <div className="dsc-troco-container-valueToPay">
                                        {valueToPay && pay && pay < cart.total && pay != null &&
                                            <p >R$ {(cart.total - pay).toFixed(2)}</p>

                                        }
                                    </div>
                                    <h4>Troco:</h4>
                                    <div className="dsc-troco-container-troco">
                                        {pay != undefined && pay > cart.total &&
                                            <p className="dsc-troco">R$ {(pay - cart.total).toFixed(2)}</p>

                                        }
                                    </div>

                                </div>

                                <div className="dsc-payment-form">
                                    <h3>Forma da pagamento</h3>
                                    <select   className='dsc-btn dsc-btn-primary' onChange={handlePaymentMethod}>
                                        <option value="">Selecione a forma de pagamento</option>
                                        <option value="debit_card">Cartão de débito</option>
                                        <option value="credit_card">Cartão de crédito</option>
                                        <option value="Dinheiro">Dinheiro</option>
                                        <option value="pi">Pix</option>
                                    </select>

                                    <button className="dsc-btn dsc-btn-blue" onClick={handlePagamento}>Pagar</button>
                                    {paymentIntentId && paymentStatus && <p>Status do pagamento: {paymentStatus}</p>}

                                </div>
                            </div>

                        </div>
                        )
                }


                <div className="dsc-btn-page-container">

                    <div onClick={handlePlaceOrderClick} className="dsc-btn dsc-btn-blue">
                        Finalizar Venda
                    </div>
                    <Link to="/catalog">
                        <div className="dsc-btn dsc-btn-white">
                            Produtos
                        </div>
                    </Link>
                    <div onClick={handleClearClick} className="dsc-btn dsc-btn-white">
                        Limpar Caixa
                    </div>
                </div>
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
                
                {paymentIntentId && showPaymentStatus && <PaymentStatus paymentIntentId={paymentIntentId} />}

            </section>
        </main>
    );
}