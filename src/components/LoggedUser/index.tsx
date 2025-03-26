import { Link, useNavigate } from 'react-router-dom';
import * as authService from '../../services/auth-service';
import { useContext, useEffect, useState } from 'react';
import { ContextToken } from '../../utils/context-token';
import { UserDTO } from '../../models/user';
import * as userService from '../../services/user-service';


export default function LoggedUser() {


    const [user, setUser] = useState<UserDTO>();

    useEffect(() => {
        userService.findLoggedUser()
        .then(response =>{
            setUser(response.data);
            console.log(response.data)
        });
       
    }, [user])
  console.log(user?.name);

    const { contextTokenPayload, setContextTokenPayload } = useContext(ContextToken);

    const navigate = useNavigate();

    /*Função para quandi clicar no logout */

    function handleLogoutClick() {
        authService.logout(); /* desloga*/
        setContextTokenPayload(undefined); /* e como deslogou some o token do local storage, e essa
        variavel set undefined para o context global ser atualizado  e tendner que n tem ais token*/
        navigate("/catalog");
    }

    return (
        contextTokenPayload && authService.isAuthenticated() /*se existir o token e se tiver autenticado vai retornar o usuário logado*/
            ? (
                
            <div className="dsc-logged-user">
              
              <div className="dsc-operator-name">
              <p > Operador de caixa: {user?.name}</p>
        </div>
            
                <p>{contextTokenPayload.user_name}</p>
                <span  onClick={handleLogoutClick}>Sair</span>
            </div>
            )
            :(
            <Link to="/login">
                Entrar
            </Link>
            )
    );
    
}