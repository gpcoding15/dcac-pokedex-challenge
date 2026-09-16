import * as Yup from "yup";

export const comparisonSchema = Yup.object({
    pokemon1: Yup.string().required("Select the first Pokémon"),

    pokemon2: Yup.string()
        .required("Select the second Pokémon")
        .notOneOf(
            [Yup.ref("pokemon1")],
            "Choose two different Pokémon"
        ),
});