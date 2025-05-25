import {create} from 'zustand'
import { ElementModel, WizformElementType } from '../graphql/graphql'
import { WizformElement } from '../utils/queries/elements'
import { WizformSimpleModel } from '../utils/queries/wizforms'
import { RegistrationState, UserPermissionType } from '../utils/auth/helpers'

type Data = {
    wizformsDisabled: boolean,
    currentBook: string | null,
    currentElementFilter: WizformElementType,
    currentNameFilter: string | undefined,
    elements: WizformElement [] | undefined,
    wizforms: WizformSimpleModel [] | undefined,
    currentCollection: string | null,
    registrationState: RegistrationState,
    permission: UserPermissionType
}

type Action = {
    setWizformsDisabled: (value: boolean) => void,
    setCurrentBook: (value: string) => void,
    setElementFilter: (value: WizformElementType) => void,
    setNameFilter: (value: string | undefined) => void,
    setElements: (value: WizformElement [] | undefined) => void,
    setWizforms: (value: WizformSimpleModel [] | undefined) => void,
    setCurrentCollection: (value: string) => void,
    setRegistrationState: (value: RegistrationState) => void,
    setPermission: (value: UserPermissionType) => void
}

export const useCommonStore = create<Data & Action>((set) => ({
    wizformsDisabled: false,
    currentBook: null,
    currentElementFilter: WizformElementType.Nature,
    currentNameFilter: undefined,
    elements: [],
    wizforms: [],
    currentCollection: null,
    registrationState: RegistrationState.Unregistered,
    permission: UserPermissionType.UnregisteredUser,

    setWizformsDisabled(value) {
        set({wizformsDisabled: value});
    },
    setElementFilter(value) {
        set({currentElementFilter: value});
    },
    setNameFilter(value) {
        set({currentNameFilter: value});
    },
    setElements(value) {
        set({elements: value});
    },
    setCurrentBook(value) {
        set({currentBook: value});
    },
    setWizforms(value) {
        set({wizforms: value});
    },
    setCurrentCollection(value) {
        set({currentCollection: value});
    },
    setRegistrationState(value) {
        set({registrationState: value});
    },
    setPermission(value) {
        set({permission: value});
    },
}))