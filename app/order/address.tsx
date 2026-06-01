// app/address/index.tsx  (tela do mapa)
import { useSelectAddress } from "@/hooks/useSelectedAddress";
import AddressPickerScreen from "@/components/AddressPickerScreen";
import { useSession } from "@/contexts/ctx";

export default function AddressScreen() {
	const { handleSelectAddress } = useSelectAddress();
	const { user } = useSession();

	return (
		<AddressPickerScreen
			isLoggedIn={!!user}
			onAddressConfirmed={handleSelectAddress}
			onSaveAddress={(address) => {
				// POST para salvar, depois navega para salvos
			}}
		/>
	);
}
