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


type QueryParams = {
    name: string;
}

export default function Cart() {


    const [cart, setCart] = useState<OrderDTO>(cartService.getCart()); /* já estamos iniciando
    o use state pegando p rimeiro valor que está lá no localStorage */

    const [products, setProducts] = useState<ProductDTO>();

    const [valueToPay, setValueToPay] = useState<any>(cart.total);

    const inputRef = useRef<HTMLInputElement>(null); // Cria a referência



    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus(); // Define o foco no input
        }
    }, []); // Executa apenas uma vez após a renderização inicial

    const [pay, setPay] = useState<number>();

    const { setContextCartCount } = useContext(ContextCartCount);

    const navigate = useNavigate();

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
                cartService.clearCart();/*se salvou o produto agora vamos usa clear para limpar o carrinho*/
                setContextCartCount(0); /* é importante colocar isso porque uma
             vez que vocÊ fez o pedido e limpo o carrinho tem que zerar aquela quantidade de items 
             no carrinho do cabeçalho*/
                navigate(`/confirmation/${response.data.id}`) /*uma vez que já fez o pedido
             agora ele direciona para  o confirmation do id específico*/
            })
    }



    const [queryParams, setQueryParams] = useState<QueryParams>();

    useEffect(() => {

        if (queryParams && queryParams.name) {

            productService.findByBarCode(queryParams.name)
                .then(response => {

                    const content = response.data.content;
                    setProducts(content[0]);
                    console.log(content[0]);

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
            setValueToPay(newValue);
        } else if (pay === undefined || null) {
            setValueToPay(null);
        }

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
                            </div>

                        )
                        : (<div className="dsc-card dsc-mb20">

                            {cart.items.map(item => (

                                <div key={item.productId} className="dsc-cart-item-container dsc-line-bottom">
                                    <div className="dsc-cart-item-left">
                                        <img src={item.imgUrl} alt={item.name} />
                                        <div className="dsc-cart-item-description">
                                            <h3>{item.name}</h3>
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

                            <div className="dsc-cart-total-container">
                                <h4>Total da Compra:</h4>
                                <h3>R$ {cart.total.toFixed(2)}</h3>
                            </div>

                            <div className="dsc-cart-total-container   dsc-pay">
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
                            <div className="dsc-cart-total-container ">

                                <h4>Valor a pagar:</h4>
                                {valueToPay && pay && pay < cart.total && pay != null &&
                                    <h3 className="dsc-troco">R$ {(valueToPay).toFixed(2)}</h3>

                                }
                            </div>
                            <div className="dsc-cart-total-container ">

                                <h4>Troco:</h4>
                                {pay != undefined && pay > cart.total &&
                                    <h3 className="dsc-troco">R$ {(pay - cart.total).toFixed(2)}</h3>

                                }
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

            </section>
        </main>
    );
}