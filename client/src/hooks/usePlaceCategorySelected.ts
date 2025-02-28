import { Category } from '@/features/Categories/category';
// import { findAllCategoriesWithPlaces } from '@/features/Categories/hooks/useFindAllWithPlaces';
import { create } from 'zustand';

interface PlaceCategorySelected {
	categorySelected: Category[] | null;
	setCategorySelected: (categories: Category[] | null) => void;
	firstTime: boolean;
	setFirstTime: (firstTime: boolean) => void;
}

const usePlaceCategorySelected = create<PlaceCategorySelected>((set) => ({
	firstTime: true,
	categorySelected: [],
	setCategorySelected: (categories: any) => {
		set(() => ({ categorySelected: categories }));
	},
	setFirstTime: (value: any) => {
		set(() => ({ firstTime: value }));
	},
}));

// const usePlaceCategorySelected = create<PlaceCategorySelected>((set) => {
// 	// const fetchCategories = async () => {
// 	// 	try {
// 	// 		const categories = (await findAllCategoriesWithPlaces()).data;

// 	// 		const initialCategories = categories.filter(
// 	// 			(categoria: { name: string }) =>
// 	// 				categoria.name === 'Atracciones turísticas'
// 	// 		);

// 	// 		set(() => ({ categorySelected: initialCategories }));
// 	// 	} catch (error) {
// 	// 		console.error('Error fetching categories:', error);
// 	// 	}
// 	// };

// 	// // Llamar fetchCategories después de que la aplicación haya iniciado.
// 	// // Puedes utilizar useEffect si estás en un componente funcional de React.
// 	// // Esto asegurará que la llamada asíncrona no afecte el tiempo de construcción.
// 	// fetchCategories();

// 	return {
// 		firstTime: true,
// 		categorySelected: [],
// 		setCategorySelected: (categories: any) => {
// 			set(() => ({ categorySelected: categories }));
// 		},
// 		setFirstTime: (value: any) => {
// 			set(() => ({ firstTime: value }));
// 		},
// 	};
// });

export default usePlaceCategorySelected;
