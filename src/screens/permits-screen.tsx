import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { LoadingWrapper } from "@/components/loading-wrapper";
import {
  Screen,
  ScreenContent,
  ScreenHeader,
  ScreenTitle,
} from "@/components/ui/screen";
import { useGrispi } from "@/contexts/grispi-context";
import { LoadingScreen } from "./loading-screen";
import { getKvkkPermit, updateKvkkPermit, KvkkResponse } from "@/api/kvkk";
import toast from "react-hot-toast";
import { convertPhoneNumber } from "@/lib/utils";

export const PermitsScreen = observer(() => {
  const { loading, bundle } = useGrispi();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [kvkkData, setKvkkData] = useState<KvkkResponse["cari"] | null>(null);
  const [isPermitted, setIsPermitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const requesterPhoneNumber = bundle?.context.requester.phone;

  useEffect(() => {
    if (requesterPhoneNumber) {
      setPhoneNumber(requesterPhoneNumber);
      fetchKvkkData(requesterPhoneNumber);
    }
  }, [requesterPhoneNumber]);

  const fetchKvkkData = async (phone: string) => {
    if (!bundle?.context.token) return;

    const formattedPhone = convertPhoneNumber(phone);

    if (!formattedPhone) {
      toast.error("Geçersiz telefon numarası");
      return;
    }

    setIsLoading(true);
    try {
      const response = await getKvkkPermit(formattedPhone);

      if (response.status === false) {
        toast.error(response.description, {
          duration: 2000
        });
        setKvkkData(null);
        return;
      }

      setKvkkData(response.cari);
      setIsPermitted(response.cari.kvkkOnayi === 1);
    } catch (error) {
      console.error("KVKK verisi alınamadı:", error);
    } finally {
      setIsLoading(false)
    }
  };

  const handlePermitChange = async (checked: boolean) => {
    if (!bundle?.context.token || !kvkkData) return;
    setIsLoading(true);
    try {
      const response = await updateKvkkPermit({
        ...kvkkData,
        kvkkOnayi: checked ? 1 : 0,
      });
      setKvkkData(response.cari);
      setIsPermitted(response.cari.kvkkOnayi === 1);
    } catch (error) {
      console.error("KVKK izni güncellenemedi:", error);
    }
    setIsLoading(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Screen>
      <ScreenHeader>
        <ScreenTitle>KVKK İzin Yönetimi</ScreenTitle>
      </ScreenHeader>
      <ScreenContent>
        <LoadingWrapper loading={isLoading}>
          <div className="flex flex-col gap-3 p-6">
            <div className="flex flex-col gap-4">
              <form onSubmit={() => fetchKvkkData(phoneNumber)} className="flex gap-2">
                <Input
                  type="tel"
                  autoFocus
                  placeholder="Telefon Numarası"
                  value={phoneNumber}
                  className="bg-white"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Button type="submit">Ara</Button>
              </form>

              {kvkkData && (
                <div className="flex flex-col divide-y *:py-2 *:text-xs">
                  <div className="flex justify-between items-center">
                    <span>Müşteri Kodu</span>
                    <span className="font-bold">{kvkkData.cariKodu}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Müşteri Adı</span>
                    <span className="font-bold">{kvkkData.cariIsim}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Telefon</span>
                    <span className="font-bold">{kvkkData.cariTelefon}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>KVKK İzni</span>
                    <Switch
                      checked={isPermitted}
                      onCheckedChange={handlePermitChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </LoadingWrapper>
      </ScreenContent>
    </Screen>
  );
});
