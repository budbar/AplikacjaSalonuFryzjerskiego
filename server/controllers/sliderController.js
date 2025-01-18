import { query } from "../database.js";
import { SliderSelectionEnum } from "../enums/SliderSelectionEnum.js";

export const editSlider = async (req, res) => {
    const {id} = req.params;
    const {sliderSetting} = req.body;

    try {
        const result = await query(
            "UPDATE images SET slider_selection = $1 WHERE id = $2", 
            [sliderSetting, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Błąd przy dodawaniu zdjęcia do slidera: ", error);
        res.status(500).json({ message: "Błąd przy dodawaniu zdjęcia do slidera." });
    }
};

export const getSliderImages = async (req, res) => {
    try {
        const result = await query("SELECT * FROM images WHERE slider_selection = $1", [SliderSelectionEnum.SelectedForSlider]);
        res.status(201).json(result.rows);
    } catch (error) {
        console.error("Błąd przy pobieraniu zdjęć slidera: ", error);
        res.status(500).json({ message: "Błąd przy pobieraniu zdjęć slidera." });
    }

};
