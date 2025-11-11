from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models
from app.schemas import OrganizationCreate, OrganizationOut, ParticipantCreate, ParticipantOut
from app.security import new_qr_uid

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/orgs", response_model=OrganizationOut)
def create_org(payload: OrganizationCreate, db: Session = Depends(get_db)):
    org = models.Organization(
        name=payload.name,
        contact_phone=payload.contact_phone,
        contact_email=payload.contact_email,
    )
    db.add(org)
    db.commit()
    db.refresh(org)
    return org

@router.post("/participants", response_model=ParticipantOut)
def create_participant(payload: ParticipantCreate, db: Session = Depends(get_db)):
    org = db.get(models.Organization, payload.org_id)
    if not org:
        raise HTTPException(404, "Organization not found")

    uid = new_qr_uid()
    while db.query(models.Participant).filter_by(qr_uid=uid).first():
        uid = new_qr_uid()

    p = models.Participant(
        org_id=payload.org_id,
        display_name=payload.display_name,
        phone=payload.phone,
        email=payload.email,
        preferred_contact=payload.preferred_contact,
        qr_uid=uid,
        qr_active=True,
        created_by_admin=None,
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return p

@router.get("/participants/{participant_id}/qr")
def get_participant_qr(participant_id: int, db: Session = Depends(get_db)):
    p = db.get(models.Participant, participant_id)
    if not p:
        raise HTTPException(404, "Participant not found")
    return {
        "participant_id": p.id,
        "qr_uid": p.qr_uid,
        "qr_active": p.qr_active,
        "deep_link": f"/api/v1/lookup/qr/{p.qr_uid}",
    }
