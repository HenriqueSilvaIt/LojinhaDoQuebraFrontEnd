import './style.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FormInput from '../../../components/FormInput';
import * as forms from '../../../utils/form';
import * as productService from '../../../services/product-services';
import * as categoryService from '../../../services/category-service';
import FormTextArea from '../../../components/FormTextArea';
/*o import é só import Select from 'react-select';, se você importa automatico vai trazer errado
 tem que fica igual no import da documentação ficial*/
import { CategoryDTO } from '../../../models/category';
import FormSelect from '../../../components/FormSelect';




export default function RegisterForm() {

    const params = useParams(); /* para colocara rota ul */

    const navigate = useNavigate();

    const isEditing = params.productId !== 'create'; /* se a rota for dirente de create significa que estou editando um
    produto e não criando um novo, se for create está editando  */

    const [formData, setFormData] = useState<any>({ /* any é para o type script
        n reclemar dos valores, para objeto ser um objeto livre e ter qualquer atributo dentro dele
        de qualquer tipo */
        /* os objetoa abaixo, vai ser igual o objeto do product by id do postman*/
        name: {
            value: "",
            id: "name",
            name: "name",
            type: "text",
            placeholder: "Nome",
            validation: function (value: string) {
                return /^.{3,80}$/.test(value);
            },
            message: "Favor informar um nome de 3 a 80 caracteres"
        },
        email: {
            value: "",
            id: "email",
            name: "email",
            type: "text", /* para aceitar somente númeroes*/
            placeholder: "Email",
            validation: function (value: any) {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value.toLowerCase());/*v convertido para Number*/ 
            },
            /*messagem de erro caso essa função de falso*/
            message: "Favor informar o seu email"
        },
        phone: {
            value: "", // Alterado para null, pois agora será um arquivo
            id: "phone",
            name: "phone",
            type: "Number", // Mantém o tipo como "file"
            placeholder: "Telefone",
            validation: function (value: number) {
                return  Number(value);
            },   
            message: "Favor informar um telefone válido"

        },
        password: {

            value: "",
            id: "password",
            name: "password",
            type: "password",
            placeholder: "Senha",
            validation: function (value: string) {
                return /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d][A-Za-z\d!@#$%^&*()_+]{7,19}$/.test(value);
            },
            message: "Favor informar uma senha com pelo menos 1 letra, 1 número e 1 caracterer especial"
        },
        birthdate: {
            value: "", /* valor inicial lista vazia, e depois o usuário 
            vai escolher uma ou mais categoria*/
            id: "birthdate",
            name: "birthdate",
            /*type n precisa porque já é um select do react*/
            placeholder: "DD/MM/YYYY",
            validation: function (value: number /* do tipo lista de categoria */) {
                return value;   /* tem que ter pelo menos uma categoria*/
            },
            message: "Digite a data de nascimento"  
        },
        role: {
            value: [], /* valor inicial lista vazia, e depois o usuário 
            vai escolher uma ou mais categoria*/
            id: "role",
            name: "role",
            /*type n precisa porque já é um select do react*/
            placeholder: "Perfil",
            validation: function (value: CategoryDTO[] /* do tipo lista de categoria */) {
                return value.length > 0;   /* tem que ter pelo menos uma categoria*/
            },
            message: "Escolha ao menos uma categoria",
        }
    });


    /*useEffect para carregar as categoria*/

    useEffect(() => {
        categoryService.findAllRequest() /* para buscar a lita de categoria do bakcend*/
            .then(response => {
                setCategories(response.data) /* colocando as categorias
                no useStat*/
            })
    }, []);


    useEffect(() => {

        if (isEditing)/* se for verdade o iediting quer
        dizer que a rota n é create, é de edição de produto */ {
            productService.findById(Number(params.productId)) /*number para converter para número
            se n vai reclamara*/
                .then(response => {
                    console.log(response.data); /* vai retornar o produto(objeto)
                    ou seja se for uma rota diferente de create, ele vai trazer o formulário
                    já com os dados do produto preenchido porque é editação*/
                    const newFormData = forms.updateAll(formData, response.data)
                    setFormData(newFormData); /*deixando os campos fo formulário já preenchido -  gerando
                    um novo objeto e no campo value vai colocar o valor que estava no banco de dados */
                })
        }
    }, [formData])




    function handleInputChange(event: any) {

        const { name, type, files } = event.target;

        if (type === "file") {
            setFormData(forms.updateAndValidate(formData, name, files[0])); // Armazena o arquivo
        } else {
            setFormData(forms.updateAndValidate(formData, name, event.target.value));
        }
        /* chamando função para atualizar oque o usuário ta escrevendo no input

           const dataUpdate = forms.update(formData/*objeto já com as informações do input , event.target.name/*campo da cainha
            do input que estou mexendo, event.target.value/*valor que
            digitar); /* destruturamos
        o formData para aproveitar o que tinha nele e onde tem o cmapo com o nome name
        vamos colocar o novo valor value que  está digitado 
        
        Agora novo formulário temos que preservar todo objeto, então vamos pegar tudo que já tinha no objeto, porém no campo
   value, vamos colocar o value criado na função event.target.valu*/


        /*chamando função que valida se o campo foi preenchido corretamente*/

        ; /* 1º argumento
             oque nós digitamos no campo, 2º argumento o nome do campo (exemplo price, name et)*/

        setFormData(forms.updateAndValidate(formData, event.target.name, event.target.value)); /* recebe oque tá sendo  digitado no input
            que é q primeira função dataUpdate e valdia se for executado corretamente
            que é e a segunda função dataValited  (dataUpdate já está dentro da dataValited),
            por que aqui só colocamos  dataValited*/

    }

    function handleTurnDirty(name: string) {
        setFormData(forms.dirtAndValidate(formData, name)); /* agora 
            com função dirty and validate, ele fica vermelho */
    }

    const [categories, setCategories] = useState<CategoryDTO>();

    /*salvar produto  editado ou craido no formulário */
    function handleSubmit(event: any) {

        event.preventDefault();


        /* valida qualquer erro de formulário do front end*/
        const formDataValidated = forms.dirtyAndValidateAll(formData);
        if (forms.hasAnyInvalid(formDataValidated)) { /* se tiver algum invalido
            deppois de validar o preenchimento de todos os campos*/
            setFormData(formDataValidated);

            return; /* esse return vai corta e não vai deixa salvar*/

        }
        const requestBody = forms.toValues(formData);
        // Adiciona o arquivo de imagem ao FormData
        if (formData.imgUrl.value) {
            requestBody.append("imgUrl", formData.imgUrl.value);
        }


        if (isEditing) {
            requestBody.id = params.productId; /* vamos setar o Id
            porque estamos editando o produto, caso n tiver editando n
            colocamos o id porque ele pega automatico do banco */
        }

        /*valida erro de formulário do backend caso o front n pega*/


        // Adiciona os outros campos ao FormData
        Object.entries(forms.toValues(formData)).forEach(([key, value]) => {
            if (key !== "imgUrl") { // Ignora o campo imgUrl aqui, pois já o pegamos abaixo
                requestBody.append(key, value);
            }
        });


        const request = isEditing
            ? productService.updateRequest(requestBody) /*editar produto */
            : productService.insertRequest(requestBody) /* salvar novo produto */

        request
            .then(() => {
                navigate("/admin/products");
            }).catch(erro => {
                const newInputs = forms.setBackendErrors(formData, erro.response.data.errors);
                setFormData(newInputs);
            })



        /* console.log(forms.toValues(formData)); to values 
         converte todo objeto  do formData somente para os dados do formulário 
         para enviarmos para nosso backend */

    }

    // Define a functional component named UploadAndDisplayImage

    // Define a state variable to store the selected image


    const [imagem, setImagem] = useState<File | null>(null);
    const [imagemPreview, setImagemPreview] = useState<string | null>(null);
    const [imagemDirty, setImagemDirty] = useState(false);
    const [imagemInvalida, setImagemInvalida] = useState(false);

    function handleImagemChange(file: File) {
        setImagem(file);
        setImagemPreview(URL.createObjectURL(file));
        setImagemInvalida(file.size > 1000000); // 1MB de limite
    }

    function handleImagemTurnDirty(nome: string) {
        setImagemDirty(true);
    }


    return (


        <main>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />

            <section id="product-form-section" className="dsc-container">
                <div className="dsc-product-form-container">
                    <form className="dsc-card dsc-form" onSubmit={handleSubmit}>
                        <h2>Novo usuário</h2>
                        <div className="dsc-form-controls-container">
                            <div>
                                <FormInput {...formData.name}
                                    className="dsc-form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="dsc-form-error">{formData.name.message}</div>
                            </div>
                            <div>
                                <FormInput {...formData.email}
                                    className="dsc-form-control"
                                    onChange={handleInputChange}
                                    onTurnDirty={handleTurnDirty}
                                />
                                <div className="dsc-form-error">{formData.email.message}</div>
                            </div>

                            <div>
                                <FormInput {...formData.phone}
                                    className="dsc-form-control"
                                    onChange={handleInputChange}
                                    onTurnDirty={handleTurnDirty}
                                />
                                <div className="dsc-form-error">{formData.phone.message}</div>
                            </div>
                            <div>

                                <FormInput  /*Select, porém customizado em um componente ta sendo chamado lá*/
                                    {...formData.password} /* vamos pegar tudo que tinha já
                                no formData do categories, exceto o validate que estamos
                                desistruturando excluindo lá no Componente FormSelect*/
                                    className="dsc-form-control "
                                onTurnDirty={handleTurnDirty} 
                                onChange={handleInputChange}/*turn dirty é para
                                ficar vermelho caso o usuário n termine de escrever o que tem que ser preenchido
                                e clique no próximo campo */
                                />
                                <div className="dsc-form-error">{formData.password.message}</div>
                            </div>

                            <div>
                                <FormInput {...formData.birthdate}
                                    className="dsc-form-control"
                                    onTurnDirty={handleTurnDirty}
                                    onChange={handleInputChange}
                                />
                                <div className="dsc-form-error">{formData.birthdate.message}</div>
                            </div>
                        </div>
                      
                        <div className="dsc-product-form-buttons">
                            <Link to="/admin/products">
                                <button type="reset" className="dsc-btn dsc-btn-white">Cancelar</button>
                            </Link>
                            <button type="submit" className="dsc-btn dsc-btn-blue">Salvar</button>
                        </div>
                    </form>
                </div>
            </section>
        </main>


    )
} 