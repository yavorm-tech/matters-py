import { DeploymentForm } from "../Forms/DeploymentForm";
import { DeploymentsTable } from "../Tables/DeploymentsTable";
import React,{FC, useState, useRef, useEffect, PropsWithChildren} from 'react';
import { Button, Modal,  Checkbox, Label, TextInput, CustomFlowbiteTheme } from 'flowbite-react';
import { buttonTheme } from "../../themes/buttonTheme";
import { CustomButton } from "../../Presentational/Button/CustomButton";
import { HiOutlineArrowRight } from "react-icons/hi";
import { modalTheme } from "../../themes/modalTheme";

export const DeploymentsPanel:FC<PropsWithChildren> = ({children}) => {
    const [openModal, setOpenModal] = useState<string | undefined>();
    const [modalPlacement, setModalPlacement] = useState<string>('center');
    const [email, setEmail] = useState("");
    const props = { openModal, setOpenModal, email, setEmail, setModalPlacement, modalPlacement };

    return (
        <>
        <CustomButton action={() => props.setOpenModal('dismissible')} color="green" > New </CustomButton>
        <Modal show={props.openModal === 'dismissible'} size="3xl" popup onClose={() => props.setOpenModal(undefined)} position="center" theme={modalTheme} >
        <Modal.Header>Add new deployment</Modal.Header>
        <Modal.Body>
          <DeploymentForm test="one" action={() => setOpenModal('undefined')} />
        </Modal.Body>
      </Modal>
        <DeploymentsTable />
        </>
    )
}