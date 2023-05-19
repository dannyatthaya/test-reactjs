import { Axios } from "@/types/axios";
import { camelCase } from "lodash";

const moduleFiles = import.meta.glob<Record<string, any>>('@/apis/modules/**/*', { eager: true });
const importedModules: any = {};

Object.entries(moduleFiles).forEach((module) => {
  const moduleName = module[0].replace(/(\.\/|\.ts)/g, "")
    .replace('/src/apis/modules/', '')
    .replace('/', '-')

  importedModules[camelCase(moduleName)] = module[1].default;
});

export default importedModules as Axios.Service.List;