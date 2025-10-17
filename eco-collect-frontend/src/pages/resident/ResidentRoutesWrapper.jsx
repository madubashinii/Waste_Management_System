import { ResidentProvider } from '../../context/ResidentContext';
import ResidentRoutes from './ResidentRoutes';

export default function ResidentRoutesWrapper() {
    return (
        <ResidentProvider>
            <ResidentRoutes />
        </ResidentProvider>
    );
}