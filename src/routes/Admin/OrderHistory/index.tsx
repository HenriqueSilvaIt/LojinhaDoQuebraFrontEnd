import './style.css';
import { useEffect, useState } from 'react';
import { OrderDTO, OrderItemDTO } from '../../../models/order';
import * as orderService from '../../../services/order-service'
import moment from 'moment'; // Importe moment.js
import { formatDateToFilter } from '../../../services/product-services';
import deleteImg from '../../../assets/delete.svg';
import DialogConfirmation from '../../../components/DialogConfirmation';
import DialogInfo from '../../../components/DialogInfo';
import ButtonNextPage from '../../../components/ButtonNextPage';

type QueryParams = {
    page: number;
    size: number;
};

export default function OrderHistory() {

    const [isLastPage, setIsLastPage] = useState(false);
    const [allOrders, setAllOrders] = useState<OrderDTO[]>([]);
    const [orderItems, setOrderItems] = useState<OrderItemDTO[]>([]); // Estado para a lista plana de itens
    const [filterDate, setFilterDate] = useState<string>('');
    const [filterMonth, setFilterMonth] = useState<string>('');
    const [filterWeek, setFilterWeek] = useState<string>('');
    const [totalSales, setTotalSales] = useState<number>(0); // Novo estado para o total de vendas
    const [queryParams, setQueryParams] = useState<QueryParams>({
        page: 0,
        size: 10, // Defina um tamanho de página padrão
    });

    const [dialogInfoData, setDialogInfoData] = useState<{
        visable: boolean;
        message: string;
    }>({
        visable: false,
        message: 'Sucesso'
    });

    const [dialogConfirmationData, setDialogConfirmationData] = useState<{
        visable: boolean;
        orderId: number | null;
        productId: number | null;
        message: string;
    }>({
        visable: false,
        orderId: null,
        productId: null,
        message: 'Tem certeza?'
    });

    useEffect(() => {
        setFilterDate(moment().format('YYYY-MM-DD'));
        orderService.findAll(queryParams.page, queryParams.size).then((response: any) => {
            setIsLastPage(response.data.last);
            const newOrders = response.data.content;
            setAllOrders(prevAllOrders => [...prevAllOrders, ...newOrders]); // Acumula os novos pedidos
        });
    }, [queryParams.page, queryParams.size]);
    useEffect(() => {
        let filteredOrders: OrderDTO[] = allOrders;
    
        if (filterDate) {
            filteredOrders = filteredOrders.filter((order) => formatDateToFilter(order.moment) === filterDate);
        }
        if (filterMonth) {
            filteredOrders = filteredOrders.filter((order) => moment(order.moment).format('YYYY-MM') === filterMonth);
        }
        if (filterWeek) {
            filteredOrders = filteredOrders.filter((order) => moment(order.moment).format('YYYY-[W]ww') === filterWeek);
        }
    
        // Calcula o total de vendas com base nos subtotais dos itens nos pedidos filtrados
        const salesTotal = filteredOrders.reduce((orderAcc, order) => {
            const orderTotal = order.items.reduce((itemAcc, item) => itemAcc + item.subTotal, 0);
            return orderAcc + orderTotal;
        }, 0);
    
        setTotalSales(salesTotal);
    
    }, [filterDate, allOrders, filterWeek, filterMonth]);

    function handleDialogConfirmationAnswer(answer: boolean, orderId: number | null, productId: number | null) {
        if (answer === true && orderId !== null && productId !== null) {
            orderService.deleteById(orderId, productId)
                .then(() => {
                    setAllOrders(allOrders.filter((order: OrderDTO) => order.id !== orderId));
                    setDialogInfoData({ visable: true, message: "Item excluido com sucesso" });
                })
                .catch(error => {
                    setDialogInfoData({
                        visable: true,
                        message: error.response.data.error
                    });
                });
        }
        setDialogConfirmationData({ ...dialogConfirmationData, visable: false });
    }

    function handleFilterDateChange(event: any) {
        event.preventDefault();
        setFilterDate(event.target.value);
        setFilterMonth('');
        setFilterWeek('');
    };

    function handleFilterMonthChange(event: any) {
        event.preventDefault();
        setFilterMonth(event.target.value);
        setFilterDate('');
        setFilterWeek('');
    }

    function handleFilterWeekChange(event: any) {
        event.preventDefault();
        const weekInputValue = event.target.value;
        if (weekInputValue) {
            setFilterWeek(weekInputValue);
        } else {
            setFilterWeek('');
        }
        setFilterDate('');
        setFilterMonth('');
        console.log(event.target.value)
    }

    function handleCleanFilter(event: any) {
        event.preventDefault();
        setFilterDate('');
        setFilterMonth('');
        setFilterWeek('');
    }

    function handleDeleteClick(orderId: number, productId: number) {
        setDialogConfirmationData({
            ...dialogConfirmationData,
            orderId: orderId,
            productId: productId,
            visable: true
        });
    }

    function handleNextPageClick() {
        setQueryParams({ ...queryParams, page: queryParams.page + 1 });
    }

    return (
        <main>
            <section id="product-listing-section" className="dsc-container">

                <h2 className="dsc-section-title dsc-mb20">Histórico de vendas</h2>
                <div className="dsc-btn-page-container dsc-mb20">
                    <div className="dsc-filter-container">
                        <div>
                            <h4> Dário: </h4>
                            <input
                                className="dsc-filter-date"
                                type="date"
                                value={filterDate}
                                onChange={handleFilterDateChange}
                            />
                        </div>
                        <div>
                            <h4> Mensal:</h4>
                            <input
                                className="dsc-filter-date"
                                type="month"
                                value={filterMonth}
                                onChange={handleFilterMonthChange}
                            />
                        </div>
                        <div>
                            <h4> Semanal: </h4>
                            <input
                                className="dsc-filter-date"
                                type="week"
                                name="week"
                                id="camp-week"
                                value={filterWeek}
                                onChange={handleFilterWeekChange} />
                        </div>

                        <button className="dsc-btn-clean" onClick={handleCleanFilter}>Limpar Filtro</button>
                    </div>
                </div>
                <div className="dsc-total-sales">
                    <h3>Total de vendas: </h3>
                    <h4> R$ {totalSales.toFixed(2)}</h4>
                </div>
                {

                }
                <table className="dsc-table dsc-mb20 dsc-mt20">
                    <thead>
                        <tr>
                            <th className="dsc-tb576">Número da venda</th>
                            <th>Nome da Produto</th>
                            <th className="dsc-tb768">Data</th>
                            <th className="dsc-tb768">Quantidade de produtos</th>
                            <th>Valor</th>
                            <th>Deletar pedido</th>
                        </tr>
                    </thead>
                   <tbody>
    {allOrders.map((order) => (
        order.items.map((item) => (
            <tr key={`${order.id}-${item.productId}`}> {/* Chave combinada */}
                <td className="dsc-tb576">{order.id}</td> {/* Agora acessível de order */}
                <td>{item.name}</td>
                <td className="dsc-tb768">{moment(order.moment).format('DD/MM/YYYY HH:mm')}</td> {/* Agora acessível de order */}
                <td className="dsc-tb768">{item.quantity}</td>
                <td>R$ {item.subTotal.toFixed(2)}</td>
                <td>
                    <img
                        onClick={() => {
                            if (order.id !== undefined && item.productId !== undefined) {
                                handleDeleteClick(order.id, item.productId);
                            } else {
                                console.error("IDs de pedido ou produto indefinidos.");
                            }
                        }}
                        className="dsc-product-listing-btn"
                        src={deleteImg}
                        alt="delet"
                    />
                </td>
            </tr>
        ))
    ))}
</tbody>
                </table>
                {!isLastPage && (
                    <ButtonNextPage onNextPage={handleNextPageClick} />
                )}
            </section>

            {dialogConfirmationData.visable && dialogConfirmationData.orderId !== null && dialogConfirmationData.productId !== null && (
                <DialogConfirmation
                    orderId={dialogConfirmationData.orderId}
                    productId={dialogConfirmationData.productId}
                    message={dialogConfirmationData.message}
                    onDialogAnswer={handleDialogConfirmationAnswer}
                />
            )}
            {dialogInfoData.visable && (
                <DialogInfo message={dialogInfoData.message} onDialogClose={() => setDialogInfoData({ ...dialogInfoData, visable: false })} />
            )}


        </main>
    );
} 