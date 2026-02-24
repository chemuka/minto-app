import { useState, useRef } from 'react';
import PropTypes from 'prop-types'
import useFetch from '../../hooks/useFetch';

const API_BASE_URL = "http://localhost:8080";

const ProfilePictureUpload = (props) => {
    const { currentPicture, onUploadSuccess } = props;
    const { fetchWithAuth } = useFetch();
    const [preview, setPreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileSelect = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) { setError('Please select an image file.'); return; }
        if (file.size > 5 * 1024 * 1024) { setError('File size must be less than 5MB.'); return; }
        setError('');
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleFileSelect(e.dataTransfer.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        console.log('selected file found: ', selectedFile.name)
        setUploading(true); setError('');
        try {
            //const res = await profileAPI.uploadPicture(selectedFile);
            //onUploadSuccess(res.data);
            const formData = new FormData();
            formData.append('file', selectedFile, selectedFile.name);
            console.log('Calling fetch to upload picture')
            const response = await fetchWithAuth('http://localhost:8080/api/v1/profile/picture', {
                method: 'POST',
                body: formData,
            })

            console.log('Response: ', response)
            if (!response.ok) {
                toast.error('HTTP Error: Network response not OK!')
                throw new Error('Network response was not ok!')
            }
            
            const data = await response.json()
            console.log('GetUserData: ', data)
            onUploadSuccess(data)
            setPreview(null);
            setSelectedFile(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed.');
        } finally { setUploading(false); }
    };

    const cancel = () => { setPreview(null); setSelectedFile(null); setError(''); };

    const currentProfilePic = currentPicture ? `${API_BASE_URL}${currentPicture}` : '';
    const displayPicture = preview || currentProfilePic;

    return (
        <div style={s.wrapper}>
            {/* Avatar Display */}
            <div style={s.avatarSection}>
                <div style={s.avatarContainer}>
                    {displayPicture ? (
                        <img src={displayPicture} alt="Profile" style={s.avatar} />
                    ) : (
                        <div style={s.avatarPlaceholder}>
                            <span style={s.avatarIcon}>👤</span>
                        </div>
                    )}
                    {preview && <div style={s.previewBadge}>Preview</div>}
                </div>
            </div>

            {/* Upload Area */}
            <div
                style={{ ...s.dropZone, ...(dragOver ? s.dropZoneActive : {}) }}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => handleFileSelect(e.target.files[0])}
                />
                <div style={s.dropIcon}>📷</div>
                <p style={s.dropText}>{dragOver ? 'Drop it!' : 'Click or drag & drop'}</p>
                <p style={s.dropHint}>JPG, PNG, GIF, WebP · Max 5MB</p>
            </div>

            {error && <div style={s.error}>{error}</div>}

            {selectedFile && (
                <div style={s.actions}>
                    <button style={s.cancelBtn} onClick={cancel}>Cancel</button>
                    <button style={{...s.uploadBtn, opacity: uploading ? 0.7 : 1}} onClick={handleUpload} disabled={uploading}>
                        {uploading ? 'Uploading...' : '✅ Save Picture'}
                    </button>
                </div>
            )}
        </div>
    );
}

ProfilePictureUpload.propTypes = {
    currentPicture: PropTypes.any,
    onUploadSuccess: PropTypes.func,
}

export default ProfilePictureUpload

const s = {
    wrapper: { display:'flex', flexDirection:'column', alignItems:'center', gap:'20px' },
    avatarSection: { position:'relative' },
    avatarContainer: { position:'relative', width:'150px', height:'150px' },
    avatar: { width:'150px', height:'150px', borderRadius:'50%', objectFit:'cover', border:'4px solid #12ab34', boxShadow:'0 4px 20px rgba(102,126,234,0.3)' },
    avatarPlaceholder: { width:'150px', height:'150px', borderRadius:'50%', background:'linear-gradient(135deg,#e8e8f0,#d0d0e0)', display:'flex', alignItems:'center', justifyContent:'center', border:'4px solid #e5e7eb' },
    avatarIcon: { fontSize:'64px' },
    previewBadge: { position:'absolute', bottom:'4px', right:'4px', background:'#12ab34', color:'#fff', fontSize:'11px', fontWeight:'700', padding:'3px 8px', borderRadius:'20px' },
    dropZone: { width:'100%', border:'2px dashed #d1d5db', borderRadius:'12px', padding:'24px', textAlign:'center', cursor:'pointer', transition:'all 0.2s', background:'#fafafa' },
    dropZoneActive: { borderColor:'#12ab34', background:'#f0f0ff' },
    dropIcon: { fontSize:'32px', marginBottom:'8px' },
    dropText: { fontWeight:'600', color:'#374151', margin:'0 0 4px', fontSize:'15px' },
    dropHint: { color:'#9ca3af', fontSize:'12px', margin:0 },
    error: { background:'#fee2e2', color:'#dc2626', padding:'10px 14px', borderRadius:'8px', fontSize:'13px', width:'100%', boxSizing:'border-box' },
    actions: { display:'flex', gap:'10px', width:'100%' },
    cancelBtn: { flex:1, padding:'11px', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:'8px', fontWeight:'600', cursor:'pointer', fontSize:'14px' },
    uploadBtn: { flex:2, padding:'11px', background:'linear-gradient(135deg,#667eea,#764ba2)', color:'#fff', border:'none', borderRadius:'8px', fontWeight:'600', cursor:'pointer', fontSize:'14px' },
};