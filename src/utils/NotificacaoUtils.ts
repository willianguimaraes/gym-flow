import { useQuasar } from 'quasar';



export function useNotify() {
    const $q = useQuasar();

    function success(message: string) {
        $q.notify({
            type: 'positive',
            message,
            position: 'top',
            timeout: 3000
        })
    }

    function error(message: string) {
        $q.notify({
            type: 'negative',
            message,
            position: 'top',
            timeout: 3000
        })
    }

    function warning(message: string) {
        $q.notify({
            type: 'warning',
            message,
            position: 'top',
            timeout: 3000
        })
    }

    function info(message: string) {
        $q.notify({
        type: 'info',
        message,
        position: 'top',
        timeout: 3000
        })
    }

    return {
        success,
        error,
        warning,
        info
    }

}
