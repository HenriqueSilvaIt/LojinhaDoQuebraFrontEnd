import './style.css';
import { useEffect, useState } from 'react';
import { OrderDTO } from '../../../models/order';
import * as orderService from '../../../services/order-service'
import moment from 'moment'; // Importe moment.js
import { formatDateToFilter } from '../../../services/product-services';
import deleteImg from '../../../assets/delete.svg';
import DialogConfirmation from '../../../components/DialogConfirmation';
import DialogInfo from '../../../components/DialogInfo';
import ButtonNextPage from '../../../components/ButtonNextPage';
interface OrderResponse {
    content: OrderDTO[];
    totalPages?: number;
    totalElements?: number;
    number?: number;
    size?: number;
}

type QueryParams = {
    page: number
}


export default function OrderHistory() {

      let minhaResposta: OrderResponse | null = null; // Inicializando com null

        console.log(minhaResposta);
  
    const [allOrders, setAllOrders] = useState<OrderDTO[]>([]);
    const [order, setOrders] = useState<OrderDTO[]>([]);
    const [filterDate, setFilterDate] = useState<string>('');
    const [filterMonth, setFilterMonth] = useState<string>('');
    const [filterWeek, setFilterWeek] = useState<string>('');
    const [totalSales, setTotalSales] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const [queryParams, setQueryParams] = useState<QueryParams>({
        page: 0
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

    const pageSize = 10; // Defina o tamanho da página

    useEffect(() => {
        setFilterDate(moment().format('YYYY-MM-DD'));
        setIsLoading(true);
        setErrorMessage('');
        orderService.findAll(queryParams.page, pageSize).then((response: any) => {
            if (response.data && Array.isArray(response.data.content)) {
                setAllOrders(response.data.content);
                setOrders(response.data.content);
                setIsLastPage(response.data.last);
                if (response.data.totalPages) {
                    setTotalPages(response.data.totalPages);
                }
                if (response.data.totalElements) {
                    setTotalElements(response.data.totalElements);
                }
            } else if (response.data && Array.isArray(response.data)) {
                setAllOrders(response.data);
                setOrders(response.data);
                setIsLastPage(true); // Se não houver paginação, considera a primeira carga como a última
            } else {
                console.error("Resposta da API em formato inesperado:", response.data);
                setErrorMessage("Erro ao carregar os pedidos: Formato de dados inesperado.");
                setOrders([]);
                setAllOrders([]);
            }
        }).catch((error: any) => {
            console.error("Erro ao buscar pedidos:", error);
            setErrorMessage(error.message || 'Erro ao carregar os pedidos.');
            setOrders([]);
            setAllOrders([]);
        }).finally(() => {
            setIsLoading(false);
        });
    }, []); // Executa apenas na montagem inicial

    useEffect(() => {
        let filteredOrders: OrderDTO[] = allOrders;

        if (filterDate) {
            filteredOrders = filteredOrders.filter((order: OrderDTO) => formatDateToFilter(order.moment) === filterDate);
        }

        if (filterMonth) {
            filteredOrders = filteredOrders.filter((order: OrderDTO) => moment(order.moment).format('YYYY-MM') === filterMonth);
        }

        if (filterWeek) {
            filteredOrders = filteredOrders.filter((order: OrderDTO) => moment(order.moment).format('YYYY-[W]ww') === filterWeek);
        }

        const startIndex = 0; // Na Opção 2, 'order' é atualizado diretamente
        const endIndex = startIndex + pageSize;
        setOrders(filteredOrders.slice(startIndex, endIndex));
        setTotalSales(filteredOrders.reduce((acc: any, order: any) => acc + order.total, 0));
        setIsLastPage(filteredOrders.length <= order.length); // Atualiza isLastPage baseado nos dados filtrados
        setTotalElements(filteredOrders.length);
        setTotalPages(Math.ceil(filteredOrders.length / pageSize));

    }, [filterDate, filterMonth, filterWeek, allOrders]);

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
        setQueryParams({ ...queryParams, page: 0 });
        // Recarrega a primeira página sem filtros
        setIsLoading(true);
        orderService.findAll(0, pageSize).then((response: any) => {
            if (response.data && Array.isArray(response.data.content)) {
                setAllOrders(response.data.content);
                setOrders(response.data.content);
                setIsLastPage(response.data.last);
                if (response.data.totalPages) {
                    setTotalPages(response.data.totalPages);
                }
                if (response.data.totalElements) {
                    setTotalElements(response.data.totalElements);
                }
            } else if (response.data && Array.isArray(response.data)) {
                setAllOrders(response.data);
                setOrders(response.data);
                setIsLastPage(true);
            } else {
                console.error("Resposta da API em formato inesperado:", response.data);
                setErrorMessage("Erro ao carregar os pedidos: Formato de dados inesperado.");
                setOrders([]);
                setAllOrders([]);
            }
        }).catch((error: any) => {
            console.error("Erro ao buscar pedidos:", error);
            setErrorMessage(error.message || 'Erro ao carregar os pedidos.');
            setOrders([]);
            setAllOrders([]);
        }).finally(() => {
            setIsLoading(false);
            setQueryParams({ ...queryParams, page: 0 }); // Reseta a página após limpar
        });
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
        setIsLoading(true);
        const nextPage = queryParams.page + 1;
        orderService.findAll(nextPage, pageSize).then((response: any) => {
            if (response.data && Array.isArray(response.data.content)) {
                setOrders(prevOrders => [...prevOrders, ...response.data.content]);
                setIsLastPage(response.data.last);
                if (response.data.totalPages) {
                    setTotalPages(response.data.totalPages);
                }
                if (response.data.totalElements) {
                    setTotalElements(response.data.totalElements);
                }
                setQueryParams({ ...queryParams, page: nextPage });
            } else if (response.data && Array.isArray(response.data)) {
                setOrders(prevOrders => [...prevOrders, ...response.data]);
                setIsLastPage(true);
            } else {
                console.error("Resposta da API em formato inesperado:", response.data);
                setErrorMessage("Erro ao carregar mais pedidos: Formato de dados inesperado.");
            }
        }).catch((error: any) => {
            console.error("Erro ao buscar mais pedidos:", error);
            setErrorMessage(error.message || 'Erro ao carregar mais pedidos.');
        }).finally(() => {
            setIsLoading(false);
        });
    }

    console.log(isLoading);
console.log(errorMessage);
console.log(totalPages);
console.log(totalElements);
console.log(isLastPage);
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
                        {order.map((order) =>
                            order.items.map((item) => (
                                <tr key={`${order.id}`}>
                                    <td className="dsc-tb576">{order.id}</td>
                                    <td>{item.name}</td>
                                    <td className="dsc-tb768">{moment(order.moment).format('DD/MM/YYYY HH:mm')}</td>
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
                                            }}// Corrigido
                                            className="dsc-product-listing-btn"
                                            src={deleteImg}
                                            alt="delet"
                                        />
                                    </td>
                                </tr>))

                        )}
                    </tbody>
                </table>

                     {!isLastPage &&
                                        <ButtonNextPage onNextPage={handleNextPageClick} />
                
                                    }
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