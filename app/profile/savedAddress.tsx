import { useSelectAddress } from "@/hooks/useSelectedAddress";
import SavedAddressesScreen from "@/components/Profile/SavedAddress";
import { useRouter } from "expo-router";
import { useSession } from "@/contexts/ctx";

export default function AddressScreen() {
	const router = useRouter();
	const { session, user } = useSession();
	const { handleSelectAddress } = useSelectAddress();

	return (
		<SavedAddressesScreen
			user_id={user?.user_id}
			session={session}
			onSelectAddress={handleSelectAddress} // ← mesma função
			onBack={() => router.back()}
		/>
	);
}
