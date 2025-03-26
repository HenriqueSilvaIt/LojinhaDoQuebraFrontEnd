
export const CART_KEY= "com.devsuperior.ecommerce/Cart";
export const TOKEN_KEy = "com.devsuperior.ecommerce/art";

/* coloca variavel de ambiente e caso n esteja configura ??(operador de coalesencia nula, se n existir
 variavel da esquerda pega por padrão o valo da direita) colcoa um valor padrão no lugar */
 export const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "https://lojinhadoquebrabackend-production.up.railway.app/";  /* se 
// tiver configurado na ferramenta na nuvem a variavel, por padrão tem que ser pega
// diretóreto de lá,  mas com oestamos rodando na máquina vamos coloc aqu 
// */
export const CLIENT_ID = import.meta.env.VITE_CLIENT_ID ?? "myclientid";
export const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET ?? "myclientsecret";