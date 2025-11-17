import { useCallback, useState } from "react"

const useConfirmation = () => {
    const [show, setShow] = useState(false)
    const [confirmMsg, setConfirmMsg] = useState('')
    const [resolvePromise, setResolvePromise] = useState(null)

    const showConfirmation = useCallback((msg) => {
        setShow(true)
        setConfirmMsg(msg)
        return new Promise((resolve) => {
            setResolvePromise(() => resolve)
        })
    }, [])

    const handleConfirm = useCallback(() => {
        setShow(false)
        if(resolvePromise) {
            resolvePromise(true)
        }
    }, [resolvePromise])

    const handleCancel = useCallback(() => {
        setShow(false)
        if(resolvePromise) {
            resolvePromise(false)
        }
    }, [resolvePromise])

    return {
        show,
        confirmMsg,
        showConfirmation,
        handleConfirm,
        handleCancel,
    }
}

export default useConfirmation
