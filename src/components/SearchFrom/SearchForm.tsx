import { useContext, useEffect, useState } from "react";
import { useDebounce } from "usehooks-ts";
import "./styles.css";
import { SearchContext } from "../SearchResults/SearchContext";
import useOnlineStatus from "../../Hooks/useIsOnline";

export function SearchForm() {
   const { changeUsers, setErrorChange, setLoadingChange } =
      useContext(SearchContext);
   const [search, setSearch] = useState<string>("");
   const [offline, setOffline] = useState(false);
   const debouncedValue = useDebounce<string>(search, 1000);

   const changeText = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearch(value);
   };

   const isOnline = useOnlineStatus();

   useEffect(() => {
      if (!isOnline) {
         setOffline(true);
         return;
      }
      const fetchUsers = async () => {
         try {
            setLoadingChange(true);
            const response = await fetch(
               `https://dummyjson.com/users/search?q=${search}`
            );
            const data = await response.json();
            changeUsers(data);
         } catch (error) {
            setErrorChange(true);
         } finally {
            setLoadingChange(false);
         }
      };
      fetchUsers();
   }, [debouncedValue]);

   return (
      <div className="searchForm">
         {!offline ? (
            <form>
               <input type="text" value={search} onChange={changeText} />
            </form>
         ) : (
            <p>Отсутствует интернет, попробуйте пожалуйста позднее</p>
         )}
      </div>
   );
}
