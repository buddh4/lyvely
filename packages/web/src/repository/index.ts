import Axios from "axios";
import { Icons } from "@/modules/ui/components/icon/Icons";
import { useGlobalDialogStore } from "@/modules/core/store/global.dialog.store";

// TODO: abstract this away in config or something..
const apiURL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";
const repository = Axios.create({ baseURL: apiURL });

export function createApiUrl(path: string) {
  path = path.charAt(0) === "/" ? path : "/" + path;
  return apiURL + path;
}

export function createFileUrl(hash: string) {
  // TODO (file) this is just a dummy implementation, and does not work at the moment...
  return createApiUrl("/files/" + hash);
}

repository.defaults.withCredentials = true;

repository.interceptors.response.use(undefined, (error) => {
  return new Promise((resolve, reject) => {
    console.error(error);
    if (!error.response) {
      console.log(error);
      useGlobalDialogStore().showError({
        icon: Icons.error_network.name,
        title: "error.network.title",
        message: "error.network.message",
      });
    } else if (error.response.status === 403) {
      console.warn("Unauthorized request detected...");
    }

    reject(error);
  });
});

export default repository;
