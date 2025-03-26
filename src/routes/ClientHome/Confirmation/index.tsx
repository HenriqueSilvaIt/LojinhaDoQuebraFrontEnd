import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as orderService from '../../../services/order-service';
import { OrderDTO } from "../../../models/order";
import { Link } from "react-router-dom";
import './style.css';

export default function Confirmation() {

    const params = useParams();

    const [order, setOrder] = useState<OrderDTO>();

    useEffect(() => {
        orderService.findByIdRequest(Number(params.orderId))
            .then(response => {
                setOrder(response.data); /*response.data é o objeto que tem no OrderItemDto
                     e no requsição do postman*/
            })
    }, []);

    return (

        <main>
            <section id="confirmantion-section" className="dsc-container dsc-mt20">

                <div className="dsc-card dsc-mb20">

                    {order?.items.map(item => (

                        <div key={item.productId} className="dsc-cart-item-container dsc-line-bottom">
                            <div className="dsc-cart-item-left">
                                <img src={item.imgUrl} alt={item.name} />
                                <div className="dsc-cart-item-description">
                                    <h3>{item.name}</h3>
                                    <div className="dsc-cart-item-quantity-container">
                                        <p>{item.quantity}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="dsc-cart-item-right">R$ {(item.subTotal.toFixed(2))}</div>
                        </div>
                    ))
                    }

                    <div className="dsc-cart-total-container">
                        <h4>Total:</h4>
                        <h3>R$ {order?.total.toFixed(2)}</h3>
                    </div>
                </div>

                <div className="dsc-confirmation-message dsc-mb20">
                    Venda número {order?.id} realizada!
                </div>
                <div className="dsc-btn-page-container">

                    <Link to="/" >
                        <div className="dsc-btn dsc-btn-white">
                            Início
                        </div>
                    </Link>
                </div>
            </section>
        </main>



    );
}    