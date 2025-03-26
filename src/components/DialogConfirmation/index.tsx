import ButtonPrimary from "../ButtonPrimary";
import ButtonSecondy from "../ButtonSecondy";

type Props = {
    id: number;
    message: string;
    onDialogAnswer: Function;
}


export default function DialogConfirmation({id, message, onDialogAnswer}: Props) {

    return (/*colocando onClick para fechar quando clicar fora onDialogAnwser(false)}, vamos 
        passar o valor falso, porque a resposta é para sair da caixinha
        e onClick={(e) => e.stopPropagation()}> é para quando clicar na caixinha
        de aviso n fechar, só no botão fech ou clicando for */
        <div className="dsc-dialog-background" onClick={() => onDialogAnswer(false, id)}> 
             */
            <div className="dsc-dialog-box" onClick={(e) => e.stopPropagation()}>
                <h2>{message}</h2>

                <div className="dsc-dialog-btn-container">  
                <div onClick={() => onDialogAnswer(false, id)} > 
                <ButtonSecondy text="Não"/>
                </div>
                <div  onClick={() => onDialogAnswer(true, id)}>
                <ButtonPrimary  text="Sim" />
                </div>
                </div>
                <div className="dsc-dialog-btn-container">   
            
                </div>
            </div>
        </div>
    )/* 
        Nesse caso se clicar no botão não, ele vai retornar false e vai sair da caixinha dialog modal
        se for Sim, ele vai fazer a ação do delete com o true 
    n tem como colocar on click direto no botão porque botão n tem os eventos  própios
    dele por isso colocamos em um div, tem que declarar desa forma 
    onClick={() => onDialogClose()}, porque o onClick tem um tipo específico que recebe de argumento
    por isso que nós t emos que colocar dessa forma, para chamara  função onDialogClose quando clicar no botã*/
}