import { CollectorProvider } from '../../context/CollectorContext';
import CollectorRoutes from './CollectorRoutes';

export default function CollectorRoutesWrapper() {
    return (
        <CollectorProvider>
            <CollectorRoutes />
        </CollectorProvider>
    );
}
