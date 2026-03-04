import logoImage from "@/assets/logo.webp"
import Image from "next/image"
export default function Logo({ ...ref }) {
    return (
        <Image {...ref} src={logoImage} alt="ZBazar BD Logo" width={160} height={40} />
    )
}
