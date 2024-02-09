export class KvApi {
  static URL = "https://seaport-playground.jfin.workers.dev";

  static async allKeyValues() {
    const response = await fetch(`${KvApi.URL}/data`);
    return response.json();
  }

  static async writeKeyValue(key: string, value: string) {
    const response = await fetch(`${KvApi.URL}/data/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    });
    return response.json();
  }

  static async deleteKey(key: string) {
    const response = await fetch(`${KvApi.URL}/data/${key}`, {
      method: "DELETE",
    });
    return response.json();
  }
}
