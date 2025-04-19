//importações
import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable} from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import { CaretLeft } from "phosphor-react-native";
import { useRouter } from "expo-router";

//função principal
export default function PokemonDetails() {
  //busca o id na url
  const {id} = useLocalSearchParams();
  //cria a array de pokemons para 
  const [pokemon, setPokemon] = useState<any>(null);

  //router para a navegação
  const router = useRouter();

  //faz a busca por meio do id após o id ser carregado
  useEffect(() => {
    //função de busca
    const fetchPokemon = async () => {
      //tentativa de busca
      try {
        //pega os dados do pokémon com base no id (por ser apenas um, o processo é bem mais simples)
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        //altera a array Pokemon com base nos dados da busca
        setPokemon(response.data);
      } 
      //mensagem caso ocorra um erro
      catch (error) {
        console.error("Erro ao buscar detalhes do Pokémon:", error);
      }
    };
    //chama a função
    fetchPokemon();
  }, [id]);

  //mensagem de carregamento 
  if (!pokemon) {
    return <Text>Carregando...</Text>;
  }
  
  //retorna a parte visual
  return (
    //container global
    <View style={styles.container}> 
    {/*botão de voltar*/}
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <CaretLeft size={50}/> 
      </Pressable>

      {/*imagem do pokémon*/}
      <Image
        source={{ uri: pokemon.sprites.other["official-artwork"].front_default }}
        style={styles.image}
      />

      {/*nome do pokémon*/}
      <Text style={styles.name}>#{pokemon.id.toString().padStart(3, "0")} - {pokemon.name}</Text>

      {/*container com as informações do pokémon*/}
      <View style={styles.infoContainer}>
        {/*altura do pokémon*/}
        <Text style={styles.sectionTitle}>Altura: {pokemon.height / 10} m</Text>

        {/*peso do pokémon*/}
        <Text style={styles.sectionTitle}>Peso: {pokemon.weight / 10} kg</Text>

        {/*abilidades do pokémon*/}
        <View>
          <Text style={styles.sectionTitle}>Habilidades:</Text>
          {pokemon.abilities.map((item: any, index: number) => (
            <Text key={index} style={styles.ability}>
            - {item.ability.name}
            </Text>
          ))}
        </View>

        {/*tabela com os status do pokémon*/}
        <Text style={styles.sectionTitle}>Status Base:</Text>
        <View style={styles.table}>
        {pokemon.stats.map((stat: any, index: number) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.statName}>{stat.stat.name}</Text>
          <Text style={styles.statValue}>{stat.base_stat}</Text>
        </View>
         ))}
        </View>
      </View>

    </View>
  );
}

//stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFF"
  },
  backButton: {
    position: "absolute",
    top: 20, 
    left: 0
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    marginTop: 20,
    backgroundColor:"#f2f2f2",
    borderRadius: 10,
  },
  name: {
    fontSize: 40,
    textTransform: "capitalize",
    marginBottom: 20,
    fontWeight: "700",
    color: "#212121",
  },
  infoContainer:{
    justifyContent: "space-around",
    paddingTop: 10,
    width: "100%",
    backgroundColor:"#F7776A",
    paddingHorizontal: 20,
    flex: 1,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: -2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 10, 
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",

  },
  ability: {
    fontSize: 16,
    fontWeight: "500",
    textTransform: "capitalize",
    color: "#fff",
  },
  table: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  statName: {
    textTransform: "capitalize",
    fontWeight: "500",
    fontSize: 16,
    color: "#333",
  },
  statValue: {
    fontWeight: "600",
    fontSize: 16,
    color: "#F7776A",
  },
});