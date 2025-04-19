//importações
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { CaretRight, MagnifyingGlass } from 'phosphor-react-native';
import axios from 'axios';
import { useRouter } from "expo-router";
import { Pressable } from "react-native";

//definindo o tipo Pokemon, que será utilizado para a criação dos cards
type Pokemon = {
  id: number;
  name: string;
  image: string;
};

//função principal
export default function Index() {
  //cria uma array de pokemons, indicando que nela será armazendo o tipo Pokemon descrito acima e seta o valor inicial como vazio
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  //variável para armazenar o texto de busca
  const [searchText, setSearchText] = useState("");
  //array com os pokémons filtrados pela busca
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  //const para verificar se as buscas estão sendo realizadas
  const [isLoading, setIsLoading] = useState(true);

  
  //router para a navegação
  const router = useRouter();

  //ao carregar a array, executa o código:
  useEffect(() => {
    //função de busca(fetch), assíncrona(a página não depende dela para carregar) para buscar os pokemons na api
    const fetchPokemons = async () => {
      //faz uma tentativa de busca
      try {
        //armazena a resposta da requisição em uma array e limita até o número 1025 da pokédex, que é o último excluindo formas alternativas
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1025");
        //armazena a array results da resposta em uma array própria
        const results = response.data.results;

        //busca dos dados necessários para o card na url individual de cada pokémon, presentes na array results
        const detailed = await Promise.all(
          //percorre cada item do results, que contém o nome e o url do pokémon
          results.map(async (pokemon: { name: string; url: string }) => {
            //busca as informações em cada url individual e salva na array details
            const details = await axios.get(pokemon.url);
            //retorna os dados necessarios, salvando em um item que segue o tipo Pokemon na array detailed
            return {
              id: details.data.id,
              name: details.data.name,
              image: details.data.sprites.front_default,
            };
          })
        );
        //seta a const pokemons com os dados da array detailed, ou seja, da busca final com os detalhes necessários
        setPokemons(detailed);
      }
      //código para caso a tentaiva de busca falhe
      catch (error) {
        console.error("Erro ao buscar pokémons", error);
      }
      //quando a busca finaliza, a const que verifica o carregamento é setada como false
      finally {
        setIsLoading(false); 
      }
    };
    //chama a função de busca
    fetchPokemons();
  }, /*realiza a busca apenas uma vez*/[]);

  //quando o estado da variável searchText e da array pokemons se alterar, executa o código:
  useEffect(() => {
    //array para armazenar os pokemons filtrados
    const filtered = pokemons.filter(
      //filtro baseado na inclusão do texto da pesquisa no nome ou no id do pokemon
      (pokemon) =>
        //coloca em lowercase para possibilitar buscas como infeNaPE, PIKaCHU, etc.
        pokemon.name.toLowerCase().includes(searchText.toLowerCase()) ||
        //seta o id pro mesmo padrao do card para possibilitar buscas como 012, 001, etc.
        pokemon.id.toString().padStart(3, '0').includes(searchText)
    );
    //seta a array filtered, com os filtro 
    setFilteredPokemons(filtered);
  }, [searchText, pokemons]);


  //retorna a parte visual
  return (
    //container global
    <View style={styles.container}>
      {/*container header*/}          
      <View style={styles.header}>
        {/*logo pokédex*/}
        <Text style={styles.logo}>Pokédex</Text>
        {/*logo pokémon*/}
        <Image source={require('./assets/pokebola.png')} style={{ width: 32, height: 32, tintColor:"#FFF" }}/>
      </View>

      {/*texto da busca*/}
      <Text style={styles.info}>
        Encontre um Pokémon pesquisando pelo nome ou por seu número na Pokédex.
      </Text>

      {/*container da busca*/}
      <View style={styles.inputContainer}>
        {/*ícone de lupa importado da biblioteca phosphor icons*/}
        <MagnifyingGlass size={32} color="#FFF" />
        {/*input de texto pra busca*/}
        <TextInput style={styles.input} placeholder="Pesquisar" placeholderTextColor={"#FFF"} value={searchText} onChangeText={setSearchText}/>
      </View>

      {/*container do conteúdo/pokémons */}
      <View style={styles.content}>
        {/*texto de apresentação*/}
        <Text style={styles.contentText}>Todos os Pokémons</Text>
        {/*operador para mostrar o carregamento*/}
        {isLoading ? (
          //mensagem de carregamento
          <Text style={styles.loadingMessage}>
            Carregando Pokémons...
          </Text>
        ) : (
          //lista com base nos dados da busca na api renderizada apos o carregamento
          <FlatList
            //array com os dados que serão exibidos (linha 19)
            data={filteredPokemons}
            //identificador de cada elemento (precisa estar em string)
            keyExtractor={(item) => item.id.toString()}
            //como cada item vai ser renderizado (nesse caso, cards)
            renderItem={({ item }: { item: Pokemon }) => (
              //container principal do card
              <View style={styles.card}>
                {/*container com as informações*/}
                <View style={styles.cardInfo}>
                  {/*imagem do pokémon*/}
                  <Image source={{ uri: item.image }} style={styles.cardImage} />
                  {/*informações em texto*/}
                  <View>
                    {/*transforma o id em string e faz com que tenha no mínimo 3 dígitos*/}
                    <Text>#{item.id.toString().padStart(3, '0')}</Text>
                    {/*capitaliza (primeira letra maiúscula) o nome do pokemon*/}
                    <Text style={{ textTransform: "capitalize" }}>{item.name}</Text>
                  </View>
                </View>
                {/*ícone de redirecionamento pra página do pokemón*/}
                <Pressable onPress={() => router.push(`./pokemon/${item.id}`)}>
                  <CaretRight size={32} />
                </Pressable>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

//stylesheet
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7776A",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: "space-between",
    flexDirection: "row"
  },
  logo: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  info: {
    color: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputContainer: {
    backgroundColor: "#F98E80",
    margin: 20,
    borderRadius: 4,
    flexDirection: "row",
    padding: 10,
    gap: 15,
    alignItems: "center",
    marginBottom: 25,
  },
  input: {
    flex: 1,
    color: "#FFF",
  },
  content: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    padding: 15,
  },
  loadingMessage: {
    textAlign: "center",
    marginTop: 50, 
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    alignItems: "center",
    padding: 15,
    justifyContent: "space-between",
    borderRadius: 4,
    elevation: 5,
  },
  cardImage: {
    width: 50, 
    height: 50,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  contentText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 20,
  },
});