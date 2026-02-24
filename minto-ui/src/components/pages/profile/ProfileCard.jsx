import PropTypes from 'prop-types'
import { CalendarCheck, CalendarPlus, EnvelopeAt, FolderSymlink, PersonBadge } from 'react-bootstrap-icons'
import ProfilePictureUpload from './ProfilePictureUpload'

const ProfileCard = (props) => {
    const { profileData, message, handlePictureUpload, form, setForm, editing, setEditing, saving, handleSave } = props

    return (
        <>
            <div className='card mb-3'>
                <div className="card-header" style={{ background:'linear-gradient(135deg,#006400,#23bc56)' }}>
                    <div className="d-flex">
                        <h3 className='ms-1 text-white'>Profile</h3>
                    </div>
                </div>
                <div className="card-body p-0">
                    {message && <div style={s.toast}>{message}</div>}

                    <div className="form-group row">
                        <div className="col-lg-6 col-xl-4">
                            <div style={s.pictureSection}>
                                <h2 style={s.sectionTitle}>Profile Picture</h2>
                                {console.log('ProfileData: ', profileData)}
                                <ProfilePictureUpload
                                    currentPicture={profileData.picture}
                                    onUploadSuccess={handlePictureUpload}
                                />
                            </div>
                        </div>
                        <div className="col-lg-6 col-xl-8">
                            <div className='row pt-4 pb-2 px-4'>
                                <div style={s.infoHeader}>
                                    <div>
                                        <h1 style={s.name}>{profileData.firstName} {profileData.lastName}</h1>
                                        <p style={s.username}>{profileData.email}</p>
                                    </div>
                                    {!editing && (
                                        <button style={s.editBtn} onClick={() => setEditing(true)}>✏️ Edit</button>
                                    )}
                                </div>
                                <h5 className="my-2"><strong>About</strong></h5>
                                {editing ? (
                                    <>
                                        <div className='col-xl-6'>
                                            <div style={s.editForm}>
                                                <div style={s.field}>
                                                    <label style={s.label}>First Name</label>
                                                    <input style={s.input} value={form.firstName}
                                                        onChange={e => setForm({...form, firstName: e.target.value})}
                                                        placeholder="Your first name" />
                                                </div>
                                                <div style={s.field}>
                                                    <label style={s.label}>Last Name</label>
                                                    <input style={s.input} value={form.lastName}
                                                        onChange={e => setForm({...form, lastName: e.target.value})}
                                                        placeholder="Your last name" />
                                                </div>
                                                <div style={s.editActions}>
                                                    <button style={s.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
                                                    <button style={{...s.saveBtn, opacity: saving ? 0.7 : 1}}
                                                        onClick={handleSave} disabled={saving}>
                                                        {saving ? 'Saving...' : 'Save Changes'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className='col-xl-6'>
                                            <div style={s.infoItem}>
                                                <EnvelopeAt size={24} className="text-secondary" />
                                                <div>
                                                    <p style={s.infoLabel}>Email</p>
                                                    <p style={s.infoValue}>{profileData.email}</p>
                                                </div>
                                            </div>
                                            <div style={s.infoItem}>
                                                <PersonBadge size={24} className="text-secondary" />
                                                <div>
                                                    <p style={s.infoLabel}>Role</p>
                                                    <p style={s.infoValue}>{profileData.role}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-xl-6">
                                            <div style={s.infoItem}>
                                                <CalendarCheck size={24} className="text-secondary" />
                                                <div>
                                                    <p style={s.infoLabel}>Created At:</p>
                                                    <p style={s.infoValue}>{profileData.createdAt}</p>
                                                </div>
                                            </div>
                                            <div style={s.infoItem}>
                                                <CalendarPlus size={24} className="text-secondary" />
                                                <div>
                                                    <p style={s.infoLabel}>Updated At:</p>
                                                    <p style={s.infoValue}>{profileData.updatedAt}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

ProfileCard.propTypes = {
    profileData: PropTypes.object,
    message: PropTypes.string,
    handlePictureUpload: PropTypes.func,
    form: PropTypes.object,
    setForm: PropTypes.func,
    editing: PropTypes.bool,
    setEditing: PropTypes.func,
    saving: PropTypes.bool,
    handleSave: PropTypes.func,
}

const s = {
    toast: { position:'fixed', top:'24px', right:'24px', background:'#059669', color:'#fff', padding:'12px 20px', borderRadius:'10px', fontWeight:'600', fontSize:'14px', zIndex:1000, boxShadow:'0 4px 12px rgba(0,0,0,0.2)' },
    pictureSection: { padding:'32px', background:'linear-gradient(180deg,#f8fff7,#f0ffef)', borderRight:'1px solid #e5e7eb', borderBottom:'1px solid #e5e7eb', borderRadius: '0px 0px 0px 5px', display:'flex', flexDirection:'column', alignItems:'center', gap:'20px' },
    sectionTitle: { fontSize:'15px', fontWeight:'700', color:'#374151', margin:0, textTransform:'uppercase', letterSpacing:'0.5px' },
    infoHeader: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'24px' },
    name: { fontSize:'26px', fontWeight:'700', color:'#1a1a2e', margin:'0 0 4px' },
    username: { color:'darkgreen', fontWeight:'500', margin:0, fontSize:'15px' },
    editBtn: { background:'#f3f4f6', border:'none', borderRadius:'8px', padding:'8px 16px', cursor:'pointer', fontWeight:'600', fontSize:'13px', color:'#374151' },
    editForm: { display:'flex', flexDirection:'column', gap:'16px' },
    field: { display:'flex', flexDirection:'column', gap:'6px' },
    label: { fontWeight:'600', fontSize:'14px', color:'#374151' },
    input: { padding:'11px 14px', border:'2px solid #e5e7eb', borderRadius:'8px', fontSize:'14px', outline:'none', boxSizing:'border-box' },
    editActions: { display:'flex', gap:'10px' },
    cancelBtn: { flex:1, padding:'11px', background:'#f3f4f6', color:'#374151', border:'none', borderRadius:'8px', fontWeight:'600', cursor:'pointer' },
    saveBtn: { flex:2, padding:'11px', background:'linear-gradient(135deg,#667eea,#764ba2)', color:'#fff', border:'none', borderRadius:'8px', fontWeight:'600', cursor:'pointer' },
    infoItem: { display:'flex', alignItems:'center', gap:'12px', background:'#f9fafb', padding:'12px', marginBottom: '4px', borderRadius:'10px' },
    infoIcon: { fontSize:'22px' },
    infoLabel: { margin:'0 0 2px', fontSize:'11px', color:'#9ca3af', fontWeight:'600', textTransform:'uppercase' },
    infoValue: { margin:0, fontSize:'14px', color:'#374151', fontWeight:'500' },
}

export default ProfileCard
