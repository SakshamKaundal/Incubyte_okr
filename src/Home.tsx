
import Modal from "@/components/Modal.tsx";
import OKRForm from "@/OKRForm.tsx";

function Home() {
    return (
        <Modal buttonName={"ADD OKR"}>
            <OKRForm/>
        </Modal>
    );
}

export default Home;